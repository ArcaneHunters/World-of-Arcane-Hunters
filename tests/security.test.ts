import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import { buildWebSocketAuthMessage, buildWebSocketUrl } from '../src/net/online';
import { Sim } from '../src/sim/sim';
import { validCharName } from '../server/auth';
import { requestIp } from '../server/ratelimit';

function fakeReq(headers: Record<string, string>, remoteAddress: string) {
  const req: any = new EventEmitter();
  req.headers = headers;
  req.socket = { remoteAddress };
  return req;
}

describe('websocket authentication', () => {
  it('keeps bearer tokens out of the websocket URL', () => {
    const url = buildWebSocketUrl('https:', 'worldofclaudecraft.com');

    expect(url).toBe('wss://worldofclaudecraft.com/ws');
    expect(url).not.toContain('token');
  });

  it('sends credentials as an auth message instead of query params', () => {
    expect(buildWebSocketAuthMessage('a'.repeat(64), 42)).toEqual({
      t: 'auth',
      token: 'a'.repeat(64),
      character: 42,
    });
  });
});

describe('rate-limit client IP selection', () => {
  it('ignores spoofed x-forwarded-for from untrusted direct clients', () => {
    const req = fakeReq({ 'x-forwarded-for': '203.0.113.55' }, '198.51.100.10');

    expect(requestIp(req)).toBe('198.51.100.10');
  });

  it('uses x-forwarded-for from a trusted loopback reverse proxy', () => {
    const req = fakeReq({ 'x-forwarded-for': '203.0.113.55, 127.0.0.1' }, '127.0.0.1');

    expect(requestIp(req)).toBe('203.0.113.55');
  });
});

describe('gm privilege boundaries', () => {
  it('normal character names cannot create reserved GM-style names', () => {
    expect(validCharName('GM01')).toBe(false);
    expect(validCharName('GM99')).toBe(false);
  });

  it('does not restore gm privilege from client-controlled saved character state', () => {
    const source = new Sim({ seed: 42, playerClass: 'warrior' });
    const state = source.serializeCharacter(source.playerId) as any;
    state.gm = true;
    state.is_gm = true;

    const target = new Sim({ seed: 42, playerClass: 'warrior', noPlayer: true });
    const pid = target.addPlayer('warrior', 'Tester', { state });

    expect(target.entities.get(pid)?.gm).not.toBe(true);
  });
});
