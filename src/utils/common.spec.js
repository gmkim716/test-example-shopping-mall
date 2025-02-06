import { pick, debounce } from './common';

describe('pick util 단위테스트', () => {
  it('단일 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a')).toEqual({ a: 'A' });
  });

  it('2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a', 'b')).toEqual({ a: 'A', b: { c: 'C' } });
  });

  it('대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다', () => {
    expect(pick()).toEqual({});
  });

  it('propNames를 지정하지 않을 경우 빈 객체가 반환된다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});

describe('debounce util 단위테스트', () => {
  // 타이머 모킹 -> 0.3초 흐른 것으로 타이머를 조작 -> spy 함수 호출 확인
  beforeEach(() => {
    // 특정 테스트를 위해 모킹한 경우, teardown에서 모킹 초기화가 필요 -> 다른 테스트에 영향이 없어야 하기 때문

    // 타이머 모킹도 초기화가 필수!
    // 타이머 모킹이 초기화되지 않았을 경우, 3rd 파티 라이브러리, 전역의 teardown에서 타이머에 의존하는 로직이 fakeTimer로 인해 제대로 동작하지 않을 수 있습니다
    vi.useFakeTimers();

    // 현재시간을 정의
    vi.setSystemTime(new Date('2023-12-25'));
  });

  afterEach(() => {
    vi.useRealTimers(); // timer 모킹을 초기화
  });

  // 테스트 코드는 비동기 타이머와 무관하게 동기적으로 실행
  // 비동기 함수가 실행되기 전에 단언이 실행됨
  // 의도한 시간(0.3초) 만큼 딜레이를 해야만 테스트가 통과 => 타이머 모킹!
  it('특정 시간이 지난 후 함수가 호출된다.', () => {
    vi.useFakeTimers();

    const spy = vi.fn();

    const debounceFn = debounce(spy, 300);

    debounceFn();

    vi.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalled();
  });

  it('연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다.', () => {
    const spy = vi.fn();

    const debounceFn = debounce(spy, 300);

    // 최초 호출
    debounceFn();

    // 200ms 후 호출
    vi.advanceTimersByTime(200);
    debounceFn();

    // 100ms 후 호출
    vi.advanceTimersByTime(100);
    debounceFn();

    // 200ms 후 호출
    vi.advanceTimersByTime(200);
    debounceFn();

    // 300ms 후 호출
    // 최초 호출 후에 함수 호출 간격이 0.3초 이상 -> 5번째 호출이 유일
    vi.advanceTimersByTime(300);
    debounceFn();

    // 5번을 호출했지만, 실제 spy 함수는 단 한 번만 호출
    expect(spy).toHaveBeenCalledTimes(1); // toHaveBeenCalledTimes(n): spy 함수가 n번 호출되었는지 확인
  });
});
