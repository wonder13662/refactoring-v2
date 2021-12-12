# Chapter 03 코드에서 나는 악취
> 냄새 나면 당장 갈아라 - 켄트 벡 할머니의 육아원칙
이제 리팩터링이 어떻게 작동하는지 감이 왔을 것이다. 하지만 '적용 방법'을 아는 것과 '제때 적용'할 줄 아는 것은 다르다. 리팩터링을 언제 시작하고 언제 그만할지를 판단하는 일은 리팩터링의 작동 원리를 아는 것 못지않게 중요하다.

그런데 여기에 딜레마가 있다. 인스턴스 변수를 삭제하거나 상속 계층을 만드는 방법을 설명하기는 쉽다. 이런 일들은 간단한 문제에 속한다. 하지만 이런 일들을 '언제' 해야 하는지에 대해서는 명확하게 정립된 규정이 없다. 솔직히 나 같은 컨설턴트들은 프로그래밍 미학이라는 모호한 개념에 기댈 때가 많은데, 이에 대해서는 좀 더 구체적으로 정리해볼 필요가 있다.

이 책의 초판을 집필하면서 이 주제로 고민하는 동안 취리히에 있는 켄트 벡을 만나러 간 적이 있다. 당시 켄트는 갓 태어난 딸을 돌보느라 기저귀 냄새에 상당히 민감했던 것으로 기억한다. 그 때문인지 리팩터링할 '시점'을 설명하는데 '냄새(smell)'란 표현을 사용했다.

그렇다면 '냄새(smell)'란 표현이 프로그래밍 미학이라는 모호한 개념보다 나을까? 그렇다. 켄트와 나는 그동안 크게 성공한 프로젝트부터 거의 망한 프로젝트까지 폭넓은 코드를 보아왔다. 그 과정에서 우리는 리팩터링이 필요한, 때로는 아주 절실한 코드들에 일정한 패턴이 있다는 사실을 발견했다.(이 장은 켄트와 내가 함께 집필했다는 점을 강조하기 위해 '나'가 아닌 '우리'란 표현을 사용한다. 어느 부분을 누가 쓴 것인지는 쉽게 구분할 수 있다. 웃긴 농담은 필자가 쓴 것이고 나머지는 켄트가 쓴 것이다.)

하지만 리팩터링을 언제 멈춰야 하는지를 판단하는 정확한 기준을 제시하지는 않을 것이다. 우리 경험에 따르면 숙련된 사람의 직관만큼 정확한 기준은 없다. 종료 기준보다는 리팩터링하면 해결할 수 있는 문제의 징후를 제시하겠다. 인스턴스 변수는 몇 개가 적당한지, 메서드가 몇 줄을 넘어가면 안 좋은지 등은 각자 경험을 통해 감을 키워야 한다.

어떤 리팩터링 기법을 적용할지 모르겠다면 이 장의 내용과 부록 B를 참고해서 감을 잡기 바란다. 먼저 이 장을 (혹은 부록 B를) 읽고 코드가 풍기는 냄새(악취)가 무엇인지 찾자. 그런 다음 우리가 해법으로 제시한 리팩터링 기법을 이 책의 6~12장에서 찾아 읽고 그 냄새를 없애는데 도움이 될지 생각해본다. 여러분이 맡은 것과 완전히 똑같은 냄새를 찾이 못할지도 모르지만, 적어도 올바른 방향으로 인도하리라 기대한다.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [3.1 기이한 이름(Mysterious Name)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-1.md)
- [3.2 중복 코드(Duplicated Code)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-2.md)
- [3.3 긴 함수(Long Function)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-3.md)
- [3.4 긴 매개변수 목록(Long Parameter List)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-4.md)
- [3.5 전역 데이터(Global Data)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-5.md)
- [3.6 가변 데이터(Mutable Data)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-6.md)
- [3.7 뒤엉킨 변경(Divergent Change)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-7.md)
- [3.8 산탄총 수술(Shotgun Surgery)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-8.md)
- [3.9 기능 편애(Feature Envy)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-9.md)
- [3.10 데이터 뭉치(Data Clumps)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-10.md)
- [3.11 기본형 집착(Primitive Obsession)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-11.md)
- [3.12 반복되는 Switch문(Repeated Switches)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-12.md)
- [3.13 반복문(Loops)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-13.md)
- [3.14 성의 없는 요소(Lazy Element)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-14.md)
- [3.15 추측성 일반화(Speculative Generality)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-15.md)
- [3.16 임시 필드(Temporary Field)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-16.md)
- [3.17 메시지 체인(Message Chains)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-17.md)
- [3.18 중개자(Middle Man)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-18.md)
- [3.19 내부자 거래(Insider Trading)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-19.md)
- [3.20 거대한 클래스(Large Class)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-20.md)
- [3.21 서로 다른 인터페이스의 대안 클래스들(Alternative Classes with Different Interaces)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-21.md)
- [3.22 데이터 클래스(Data Class)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-22.md)
- [3.23 상속 포기(Refused Bequest)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-23.md)
- [3.24 주석(Comments)](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter03/3-24.md)