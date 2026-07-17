import { DomainError } from './domain-error';
import { failure, success } from './result';

describe('Result', () => {
  it('preserves a successful value', () => {
    const result = success('ready');

    expect(result).toEqual({ ok: true, value: 'ready' });
  });

  it('preserves an expected failure', () => {
    const error = new DomainError('Invalid workout duration');
    const result = failure(error);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe(error);
    }
  });
});
