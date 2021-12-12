## Chapter 09 데이터 조직화
데이터 구조는 프로그램에서 중요한 역할을 수행하니 데이터 구조에 집중한 리팩터링만 한 묶음 따로 준비했다. 하나의 값이 여러 목적으로 사용된다면 혼란과 버그를 낳는다. 그러니 이런 코드를 발견하면 [9.1 변수 쪼개기(Split Variable)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-1.md)를 적용해 용도별로 분리하자. 다른 프로그램 요소와 마찬가지로 변수 이름을 제대로 짓는 일은 까다로우면서도 중요하다. 그래서 [6.7 변수 이름 바꾸기(Rename Variable)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter06/6-7.md)와는 반드시 친해져야 한다. 한편, [9.3 파생 변수를 질의 함수로 바꾸기(Replace Derived Variable with Query)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-3.md)를 활용하여 변수 자체를 완전히 없애는 게 가장 좋은 해법일 때도 있다.

참조(`reference`)인지 값(`value`)인지 헷갈려 문제가 되는 코드도 자주 볼 수 있는데, 둘 사이를 전환할 때는 [9.4 참조를 값으로 바꾸기(Change Reference to Value)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-4.md)와 [9.5 값을 참조로 바꾸기(Change Value to Reference)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-5.md)를 사용한다.

> 이 외에도 원서 웹 버전에 수록된 다음 리팩터링을 더 번역해 실었다. 코드에 의미를 알기 어려운 리터럴이 보이면 [9.6 매직 리터럴 바꾸기(Replace Magic Literal)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-6.md)로 명확하게 바꿔준다.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [9.1 변수 쪼개기(Split Variable)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-1.md)
- [9.2 필드 이름 바꾸기(Rename Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-2.md)
- [9.3 파생 변수를 질의 함수로 바꾸기(Replace Derived Variable with Query)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-3.md)
- [9.4 참조를 값으로 바꾸기(Change Reference to Value)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-4.md)
- [9.5 값을 참조로 바꾸기(Change Value to Reference)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-5.md)
- [9.6 매직 리터럴 바꾸기(Replace Magic Literal)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter09/9-6.md)