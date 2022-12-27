import { switchAssign, switchExec, switchThrow } from './switch.helper';
import Mock = jest.Mock;

describe('switchAssign', () => {
  let mapMock: Record<string, number>;

  beforeEach(() => {
    mapMock = { one: 1, two: 2 };
  });

  it('should return value when case exists', () => {
    const value = switchAssign('two', mapMock);

    expect(value).toBe(2);
  });

  it('should return undefined when case not exists', () => {
    const value = switchAssign('three', mapMock);

    expect(value).toBeUndefined();
  });

  it('should return undefined when target is not defined', () => {
    const value = switchAssign(undefined, mapMock);

    expect(value).toBeUndefined();
  });

  it('should return fallback when target is not defined and fallback specified', () => {
    const value = switchAssign(undefined, mapMock, 3);

    expect(value).toBe(3);
  });
});

describe('switchExec', () => {
  let mapMock: Record<string, Mock>;

  beforeEach(() => {
    mapMock = {
      one: jest.fn(() => 1),
      two: jest.fn(() => 2),
    };
  });

  it('should execute function and return when case exists', () => {
    const result = switchExec('two', mapMock);

    expect(mapMock.two).toBeCalledWith('two');
    expect(result).toBe(2);
  });

  it('should execute nothing and return undefined when case not exists', () => {
    const result = switchExec('three', mapMock);

    expect(result).toBeUndefined();
  });

  it('should execute nothing and return undefined when target is not defined', () => {
    const result = switchExec(undefined, mapMock);

    expect(result).toBeUndefined();
  });

  it('should execute fallback and return when target is not defined and fallback specified', () => {
    const fallback = jest.fn(() => 3);
    const result = switchExec(undefined, mapMock, fallback);

    expect(fallback).toBeCalledWith(undefined);
    expect(result).toBe(3);
  });
});

describe('switchThrow', () => {
  let mapMock: Record<string, Error>;

  beforeEach(() => {
    mapMock = {
      one: new TypeError(),
      two: new SyntaxError(),
    };
  });

  it('should throw when case exists', () => {
    const action = () => switchThrow('one', mapMock);

    expect(action).toThrow(TypeError);
  });

  it('should not throw when case not exists', () => {
    const action = () => switchThrow('three', mapMock);

    expect(action).not.toThrow();
  });

  it('should not throw when target is not defined', () => {
    const action = () => switchThrow(undefined, mapMock);

    expect(action).not.toThrow();
  });

  it('should throw fallback when target is not defined and fallback specified', () => {
    const action = () => switchThrow(undefined, mapMock, new EvalError());

    expect(action).toThrow(EvalError);
  });
});
