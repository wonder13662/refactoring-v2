## Chapter 11 API 리팩터링
모듈과 함수는 소프트웨어를 구성하는 빌딩 블록이며, API는 이 블록들을 끼워 맞추는 연결부다. 이런 API를 이해하기 쉽고 사용하기 쉽게 만드는 일은 중요한 동시에 어렵기도 하다. 그래서 API를 개선하는 방법을 새로 깨달을 때마다 그에 맞게 리팩터링을 해야 한다.

좋은 API는 데이터를 갱신하는 함수와 그저 조회만 하는 함수를 명확히 구분한다. 두 기능이 섞여 있다면 [11.1 질의 함수와 변경 함수 분리하기(Separate Query from Modifier)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-1.md)를 적용해 갈라놔야 한다. 값 하나 때문에 여러 개로 나뉜 함수들은 [11.2 함수 매개변수화하기(Parameterize Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-2.md)를 적용해 하나로 합칠 수 있다. 한편, 어떤 매개변수는 그저 함수의 동작 모드를 전환하는 용도로만 쓰이는데, 이럴 때는 [11.3 플래그 인수 제거하기(Remove Flag Argument)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-3.md)를 적용하면 좋다.

데이터 구조가 함수 사이를 건너 다니면서 필요 이상으로 분해될 때는 [11.4 객체 통째로 넘기기(Preserve Whole Object)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-4.md)를 적용해 하나로 유지하면 깔끔해진다. 무언가를 매개변수로 건네 피호출 함수가 판단할지 아니면 호출 함수가 직접 정할지에 관해서는 만고불면의 진리는 없으니, 상황이 바뀌면 [11.5 매개변수를 질의 함수로 바꾸기(Replace Parameter with Query)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-5.md)와 [11.6 질의 함수를 매개변수로 바꾸기(Replace Query with Parameter)](https://github.com/wonder13662/refactoring-v2/blob/writing/)로 균형점을 옮길 수 있다.

클래스는 대표적인 모듈이다. 나는 내가 만든 객체가 되도록 불변이길 원하므로 기회가 될 때마다 [11.7 세터 제거하기(Remove Setting Method)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-7.md)를 적용한다. 한편, 호출자에 새로운 객체를 만들어 반환하려 할 때 일반적인 생성자의 능력만으로는 부족할 때가 있다. 이럴 땐 [11.8 생성자를 팩터리 함수로 바꾸기(Replace Constructor with Factory Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-8.md)가 좋은 해법일 수 있다.

마지막 두 리팩터링은 수많은 데이터를 받는 복잡한 함수를 잘게 쪼개는 문제를 다룬다. [11.9 함수를 명령으로 바꾸기(Replace Function with Command)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-9.md)를 적용하면 이런 함수를 객체로 변환할 수 있는데, 그러면 해당 함수의 본문에서 [6.1 함수 추출하기(Extract function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter06/6-1.md)가 수월해진다. 나중에 이 함수를 단순화하여 명령 객체가 더는 필요 없어진다면 [11.10 명령을 함수로 바꾸기(Replace Command with Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-10.md)를 적용해 함수로 되돌릴 수 있다.
> 이 외에도 원서 웹 버전에 수록된 다음 리팩터링들을 더 번역해 실었다. 함수 안에서 데이터가 수정됐음을 확실히 알리려면 [11.11 수정된 값 반환하기(Return Modified Value)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-11.md)를 적용한다. 오류 코드에 의존하는 과거 방식 코드는 [11.12 오류 코드를 예외로 바꾸기(Replace Error Code with Exception)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-12.md)로 정리한다. 단, 예외는 올바른 상황에서만 정확하게 적용해야 한다. 특히, 문제가 되는 조건을 함수 호출 전에 검사할 수 있다면 [11.13 예외를 사전확인으로 바꾸기(Replace Exception with Precheck)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-13.md)로 예외 남용을 줄일 수 있다.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [11.1 질의 함수와 변경 함수 분리하기(Separate Query from Modifier)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-1.md)
- [11.2 함수 매개변수화하기(Parameterize Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-2.md)
- [11.3 플래그 인수 제거하기(Remove Flag Argument)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-3.md)
- [11.4 객체 통째로 넘기기(Preserve Whole Object)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-4.md)
- [11.5 매개변수를 질의 함수로 바꾸기(Replace Parameter with Query)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-5.md)
- [11.6 질의 함수를 매개변수로 바꾸기(Replace Query with Parameter)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-6.md)
- [11.7 세터 제거하기(Remove Setting Method)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-7.md)
- [11.8 생성자를 팩터리 함수로 바꾸기(Replace Constructor with Factory Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-8.md)
- [11.9 함수를 명령으로 바꾸기(Replace Function with Command)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-9.md)
- [11.10 명령을 함수로 바꾸기(Replace Command with Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-10.md)
- [11.11 수정된 값 반환하기(Return Modified Value)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-11.md)
- [11.12 오류 코드를 예외로 바꾸기(Replace Error Code with Exception)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-12.md)
- [11.13 예외를 사전확인으로 바꾸기(Replace Exception with Precheck)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter11/11-13.md)