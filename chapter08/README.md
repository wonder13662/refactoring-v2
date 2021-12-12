## Chapter 08 기능 이동
지금까지는 프로그램 요소를 생성 혹은 제거하거나 이름을 변경하는 리팩터링을 다뤘다. 여기에 더해 요소를 다른 컨텍스트(클래스나 모듈 등)로 옮기는 일 역시 리팩터링의 중요한 축이다. 다른 클래스나 모듈로 함수를 옮길 때는 [8.1 함수 옮기기(Move Funtion)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-1.md)를 사용한다. 필드 역시 [8.2 필드 옮기기(Move Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-2.md)로 옮길 수 있다.

옮기기는 문장 단위에서도 이뤄진다. 문장을 함수 안이나 바깥으로 옮길 때는 [8.3 문장을 함수로 옮기기(Move Statements into Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-3.md)나 [8.4 문장을 호출한 곳으로 옮기기(Move Statements to Caller)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-4.md)를 사용한다. 같은 함수 안에서 옮길 때는 [8.6 문장 슬라이드하기(Slide Statements)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-6.md)를 사용한다. 때로는 한 덩어리의 문장들이 기존 함수와 같은 일을 할 때가 있다. 이럴 때는 [8.5 인라인 코드를 함수 호출로 바꾸기(Replace Inline Code with Function Call)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-5.md)를 적용해 중복을 제거한다.

반복문과 관련하여 자주 사용하는 리팩터링은 두 가지다. 첫 번째는 각각의 반복문이 단 하나의 일만 수행하도록 보장하는 [8.7 반복문 쪼개기(Split loop)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-7.md)고, 두 번째 반복문을 완전히 없애버리는 [8.8 반복문을 파이프라인으로 바꾸기(Replace Loop with Pipeline)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-8.md)다.

마지막으로 많은 홀륭한 프로그래머가 즐겨 사용하는 리팩터링인 [8.9 죽은 코드 제거하기(Remove Dead Code)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-9.md)가 있다. 필요없는 문장들을 디지털 화염방사기로 태워버리는 것만큼 짜릿한 일도 없다.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [8.1 함수 옮기기(Move Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-1.md)
- [8.2 필드 옮기기(Move Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-2.md)
- [8.3 문장을 함수로 옮기기(Move Statements into Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-3.md)
- [8.4 문장을 호출한 곳으로 옮기기(Move Statements to Caller)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-4.md)
- [8.5 인라인 코드를 함수 호출로 바꾸기(Replace Inline Code with Function Call)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-5.md)
- [8.6 문장 슬라이드하기(Slide Statements)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-6.md)
- [8.7 반복문 쪼개기(Split loop)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-7.md)
- [8.8 반복문을 파이프라인으로 바꾸기(Replace Loop with Pipeline)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-8.md)
- [8.9 죽은 코드 제거하기(Remove Dead Code)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter08/8-9.md)