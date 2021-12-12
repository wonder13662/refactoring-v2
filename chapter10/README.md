## Chapter 10 조건부 로직 간소화
조건부 로직은 프로그램의 힘을 강화하는데 크게 기여하지만, 안타깝게도 프로그램을 복잡하게 만드는 주요 원흉이기도 하다. 그래서 나는 조건부 로직을 이해하기 쉽게 바꾸는 리팩터링을 자주 한다. 복잡한 조건문에는 [10.1 조건문 분해하기(Decompose Conditional)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-1.md)를, 논리적 조합을 명확히 다듬는 데는 [10.2 중복 조건식 통합하기(Consolidate Conditional Expression)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-2.md)를 적용한다. 함수의 핵심 로직에 본격적으로 들어가기 앞서 무언가를 검사해야 할 때는 [10.3 중첩 조건문을 보호 구문으로 바꾸기(Replace Nested Conditional with Guard Clauses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-3.md)를, 똑같은 분기 로직(주로 switch문)이 여러 곳에 등장한다면 [10.4 조건부 로직을 다형성으로 바꾸기(Replace Conditional with Polymorphism)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-4.md)를 적용한다. 

`null`과 같은 특이 케이스를 처리하는 데도 조건부 로직이 흔히 쓰인다. 이 처리 로직이 거의 똑같다면 [10.5 특이 케이스 추가하기(Introduce Special Case)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-5.md)("널 객체 추가하기(Introduce Null Object)"라고도 한다)를 적용해 코드 중복을 상당히 줄일 수 있다. 한편, (내가 조건절 없애기를 매우 좋아하는 건 사실이지만) 프로그램의 상태를 확인하고 그 결과에 따라 다르게 동작해야 하는 상횡아면 [10.6 어서션 추가하기(Introduce Assertion)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-6.md)가 도움이 된다.

이 외에도 원서 웹 버전에 수록된 다음 리팩터링을 더 번역해 실었다. 제어 플래그를 이용해 코드 동작 흐름을 변경하는 코드는 대부분 [10.7 제어 플래그를 탈출문으로 바꾸기(Replace Control Flag with Break)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-7.md)를 적용해 더 간소화할 수 있다.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [10.1 조건문 분해하기(Decompose Conditional)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-1.md)
- [10.2 중복 조건식 통합하기(Consolidate Conditional Expression)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-2.md)
- [10.3 중첩 조건문을 보호 구문으로 바꾸기(Replace Nested Conditional with Guard Clauses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-3.md)
- [10.4 조건부 로직을 다형성으로 바꾸기(Replace Conditional with Polymorphism)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-4.md)
- [10.5 특이 케이스 추가하기(Introduce Special Case)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-5.md)
- [10.6 어서션 추가하기(Introduce Assertion)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-6.md)
- [10.7 제어 플래그를 탈출문으로 바꾸기(Replace Control Flag with Break)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter10/10-7.md)