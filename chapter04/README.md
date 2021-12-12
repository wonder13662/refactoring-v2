# Chapter 04 테스트 구축하기
리팩터링은 분명 가치있는 도구지만, 그것만으로는 부족하다. 리팩터링을 제대로 하려면 불가피하게 저지르는 실수를 잡아주는 견고한 테스트 스위트(test suite)가 뒷받침돼야 한다. 자동 리팩터링 도구를 활용하더라도 이 책에서 소개하는 리팩터링 중 다수는 테스트 스위트로 재차 검증해야 할 것이다.

이게 단점은 아니다. 리팩터링을 하지 않더라도 좋은 테스트를 작성하는 일은 개발 효율을 높여준다. 테스트 작성에 시간을 빼앗기는데 효율이 높아진다니? 직관에 어긋나는 효과라서 나도 (다른 프로그래머들처럼) 처음 깨달았을 때는 상당히 놀랐다. 자, 그럼 효율이 좋아지는 이유를 함게 살펴보자.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [4.1 자가 테스트 코드의 가치(The Value of Self-Testing Code)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter04/4-1.md)
- [4.2 테스트할 샘플 코드(Sample Code to Test)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter04/4-2.md)
- [4.3 첫 번째 테스트(A First Test)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter04/4-3.md)
- [4.4 테스트 추가하기(Add Another Test)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter04/4-4.md)
- [4.5 픽스처 수정하기(Modifying the Fixture)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter04/4-5.md)
- [4.6 경계 조건 검사하기(Probing the Boundaries)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter04/4-6.md)
- [4.7 끝나지 않은 여정(Much More Than this)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter04/4-7.md)