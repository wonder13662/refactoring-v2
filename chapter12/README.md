## Chapter 12 상속 다루기
마지막 장이다. 이번 장에서는 객체 지향 프로그래밍에서 가장 유명한 특성인 상속(inheritance)을 다룬다. 다른 강력한 매커니즘처럼 이 역시 아주 유용한 동시에 오용하기 쉽다. 더욱이 상속은 발등에 불이 떨어져서야 비로소 잘못 사용했음을 알아차리는 경우가 많다.

특정 기능을 상속 계층구조의 위나 아래로 옮겨야 하는 상황은 드물지 않다. 이와 관련한 리팩터링으로는 [12.1 메서드 올리기(Pull Up Method)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-1.md), [12.2 필드 올리기(Pull Up Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-2.md), [12.3 생성자 본문 올리기(Pull Up Constructor Body)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-3.md), [12.4 메서드 내리기(Push Down Method)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-4.md), [12.5 필드 내리기(Push Down Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-5.md)가 있다. 계층 사이에 클래스를 추가하거나 제거하는 리팩터링으로는 [12.8 슈퍼클래스 추출하기(Extract Subclasses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-8.md), [12.7 서브클래스 제거하기(Remove Subclasses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-7.md), [12.9 계층 합치기(Collapse Hierarchy)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-9.md)가 있다. 때론 필드 값에 따라 동작이 달라지는 코드가 있는데, 이런 필드를 서브클래스로 대체하고 싶다면 [12.6 타입 코드를 서브클래스로 바꾸기(Replace Type Code with Subclasses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-6.md)를 이용한다.

상속은 막강한 도구지만, 잘못된 곳에서 사용되거나 나중에 환경이 변해 문제가 생기기도 한다. 이럴 때는 [12.10 서브클래스를 위임으로 바꾸기(Replace Subclass with Delegate)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-10.md)나 [12.11 슈퍼클래스를 위임으로 바꾸기(Replace Superclass with Delegate)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-11.md)를 활용하여 상속을 위임으로 바꿔준다.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [12.1 메서드 올리기(Pull Up Method)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-1.md)
- [12.2 필드 올리기(Pull Up Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-2.md)
- [12.3 생성자 본문 올리기(Pull Up Constructor Body)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-3.md)
- [12.4 메서드 내리기(Push Down Method)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-4.md)
- [12.5 필드 내리기(Push Down Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-5.md)
- [12.6 타입 코드를 서브클래스로 바꾸기(Replace Type Code with Subclasses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-6.md)
- [12.7 서브클래스 제거하기(Remove Subclasses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-7.md)
- [12.8 슈퍼클래스 추출하기(Extract Subclasses)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-8.md)
- [12.9 계층 합치기(Collapse Hierarchy)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-9.md)
- [12.10 서브클래스를 위임으로 바꾸기(Replace Subclass with Delegate)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-10.md)
- [12.11 슈퍼클래스를 위임으로 바꾸기(Replace Superclass with Delegate)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter12/12-11.md)