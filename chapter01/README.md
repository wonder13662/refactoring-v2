## Chapter 01 리팩터링: 첫번째 예시
리팩터링 이야기를 어떻게 시작하면 좋을까? 전통적인 방식을 따라 리팩터링의 역사와 여러 원칙 등을 하나씩 나열할 수도 있다. 그런데 컨퍼런스에서 누군가 이런 식으로 설명하는 걸 듣고 있자면 솔직히 살짝 졸렸다. 구체적인 예가 나오는지를 주기적으로 확인하는 백그라운드 프로세스를 머릿속에 돌려놓고는 딴 생각에 빠지곤 했다.

그러다가 예시가 등장하면 정신이 드는데, 그제야 무슨 말을 하는지 와닿기 때문이다. 원칙은 지나치게 일반화되기 쉬워서 실제 적용 방법을 파악하기 어렵지만 예시가 있으면 모든 게 명확해진다.

그래서 나는 리팩터링을 실제로 해보는 예를 책 앞 쪽에 배치했다. 내가 선보이는 리팩터링 과정을 따라오면서 리팩터링을 어떻게 수행하는지 감 잡을 수 있을 것이다. 그러고 나서 다음 장 부터는 전통적인 방식에 따라 원칙들을 하나씩 소개하겠다.

그런데 예시용 프로그램을 선정하다가 난관에 봉착했다. 프로그램이 너무 길면 코드를 설명하고 리팩터링하는 과정이 너무 복잡해서 독자가 따라오기 어렵다(초판에서 이렇게 하려다가 결국 예시 두 개는 그냥 빼버렸다. 그리 긴 프로그램이 아님에도 각기 100쪽씩이나 차지했기 때문이다). 그렇다고 바로 이해할 수 있는 간단한 프로그램을 제시하면 굳이 리팩터링할 필요를 느끼기 어려운 문제가 있다.

솔직히 이 책에 수록된 예처럼 간단한 프로그램은 굳이 내가 제시하는 리팩터링들 전부를 적용할 필요는 없다. 하지만 그 코드가 대규모 시스템의 일부라면 리팩터링을 하고 안 하고의 차이가 크니, 항시 책의 예시들이 대규모 시스템에서 발췌한 코드라고 상상하면서 따라오기 바란다. 이러한 연상 방식은 실전용 기법을 제한된 지면으로 설명하려 할 때 많이들 활용하는 기법이다.

- [목차](https://github.com/wonder13662/refactoring-v2/blob/writing/README.md)
- [1.1 자, 시작해보자!](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-1.md)
- [1.2 예시 프로그램을 본 소감](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-2.md)
- [1.3 리팩터링의 첫 단계](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-3.md)
- [1.4 statement() 함수 쪼개기](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-4.md)
- [1.5 중간 점검: 난무하는 중첩 함수](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-5.md)
- [1.6 계산 단계와 포맷팅 단계 분리하기](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-6.md)
- [1.7 중간 점검: 두 파일(과 두 단계)로 분리됨](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-7.md)
- [1.8 다형성을 활용해 계산 코드 재구성하기](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-8.md)
- [1.9 상태 점검: 다형성을 활용하여 데이터 생성하기](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-9.md)
- [1.10 마치며](https://github.com/wonder13662/refactoring-v2/blob/writing/chapter01/1-10.md)