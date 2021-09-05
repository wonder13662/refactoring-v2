## Chapter 06 기본적인 리팩터링

### 6.1 함수 추출하기(Extract function)
#### BEFORE
``` javascript
fuction printOwing(invoice) {
  printBanner();
  let outstanding = calculateOutstanding();

  // 세부 사항 출력
  console.log(`고객명: ${invoice.customer}`);
  console.log(`채무액: ${outstanding}`);
}
```
#### AFTER
``` javascript
function printOwing(invoice) {
  printBanner();
  let outstanding = calculateOutstanding();
  printDetails(outstanding);

  function printDetails(outstanding) {
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`)
  }
}
```

#### 배경
- 코드를 보고 무슨 일을 하는지 파악하는 데 한참이 걸린다면 그 부분을 함수로 추출한 뒤 '무슨 일'에 걸맞는 이름을 짓는다. 이렇게 해두면 나중에 코드를 다시 읽을 때 함수의 목적이 눈에 확 들어오고, 본문 코드(그 함수가 목적을 이루기 위해 구체적으로 수행하는 일)에 대해서는 더 이상 신경 쓸 일이 거의 없다.

#### 절차
1. 함수를 새로 만들고 목적을 잘 드러내는 이름을 붙인다('어떻게'가 아닌 '무엇을' 하는지가 드러나야 한다).
2. 추출할 코드를 원본 함수에서 복사하여 새 함수에 붙여넣는다.
3. 추출할 코드 중 원본 함수의 지역 변수를 참조하거나 추출한 함수의 유효범위를 벗어나는 변수는 없는지 검사한다. 있다면 매개변수로 전달한다.
4. 변수를 다 처리했다면 컴파일한다.
5. 원본 함수에서 추출한 코드 부분을 새로 만든 함수를 호출하는 문장으로 바꾼다.(즉, 추출한 함수로 일을 위임한다).
6. 테스트한다.
7. 다른 코드에서 방금 추출한 것과 똑같거나 비슷한 코드가 없는지 살핀다. 있다면 방금 추출한 새 함수를 호출하도록 바꿀지 검토한다([인라인 코드를 함수 호출로 바꾸기]())

#### 예시: 유효범위를 벗어나는 변수가 없을 때
##### STEP 1
``` javascript
function printOwing(invoice) {
  let outstanding = 0;

  console.log('*********************');
  console.log('********고객채무*******');
  console.log('*********************');

  // 미해결 채무(outstanding)를 계산한다.
  for (const o of invoice.orders) {
    outstanding += o.amout;
  }

  // 마감일(dueDate)를 기록한다.
  const today = Clock.today; // Clock Wrapper
  invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

  // 세부 사항을 출력한다.
  console.log(`고객명: ${invoice.customer}`);
  console.log(`채무액: ${outstanding}`);
  console.log(`마감일: ${invoice.dueDate.toLocalDateString()}`);
}
```
- 여기서 Clock.today는 내가 [Clock Wrapper](https://martinfowler.com/bliki/ClockWrapper.html)라고 부르는 것으로, 시스템 시계를 감싸는 객체다. 나는 Date.now()처럼 시스템 시간을 알려주는 함수는 직접 호출하지 않는다. 직접 호출하면 테스트할 때마다 결과가 달라져서 오류 상황을 재현하기 어렵기 때문이다.

##### STEP 2

``` javascript
function printingOwing(invoice) {
  let outstanding = 0;

  printBanner(); // [CHANGE]배너 출력 로직을 함수로 추출

  // 미해결 채무(outstanding)를 계산한다.
  for (const o of invoice.orders) {
    outstanding += o.amout;
  }

  // 마감일(dueDate)를 기록한다.
  const today = Clock.today; // Clock Wrapper
  invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

  // 세부 사항을 출력한다.
  console.log(`고객명: ${invoice.customer}`);
  console.log(`채무액: ${outstanding}`);
  console.log(`마감일: ${invoice.dueDate.toLocalDateString()}`);

  function printBanner() {
    console.log('*********************');
    console.log('********고객채무*******');
    console.log('*********************');
  }  
}
```

##### STEP 3
``` javascript
function printingOwing(invoice) {
  let outstanding = 0;

  printBanner();

  // 미해결 채무(outstanding)를 계산한다.
  for (const o of invoice.orders) {
    outstanding += o.amout;
  }

  // 마감일(dueDate)를 기록한다.
  const today = Clock.today;
  invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

  printDetails(); // [CHANGE]세부 사항 출력 로직을 함수로 추출

  function printDetails() {
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate.toLocalDateString()}`);
  }
  // printBanner 구현 메서드는 생략 
}
```

##### STEP 4
``` javascript
function printingOwing(invoice) {
  let outstanding = 0;

  printBanner();

  // 미해결 채무(outstanding)를 계산한다.
  for (const o of invoice.orders) {
    outstanding += o.amout;
  }

  recordDueDate(invoice); // [CHANGE] 마감일 설정 로직을 함수로 추출
  printDetails();

  function recordDueDate(invoice) {
    const today = Clock.today;
    invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
  }

  // printDetails, printBanner 구현 메서드는 생략
}
```

#### 예시: 지역 변수를 사용할 때
##### STEP 5
``` javascript
function printingOwing(invoice) {
  
  printBanner();

  // 미해결 채무(outstanding)를 계산한다.
  let outstanding = 0; // [CHANGE] 맨 위에 있던 선언문을 이 위치로 이동
  for (const o of invoice.orders) {
    outstanding += o.amout;
  }

  recordDueDate(invoice);
  printDetails();

  function calculateOutstanding(invoice) {
    let outstanding = 0; // [CHANGE] 추출할 코드 복사
    for (const o of invoice.orders) {
      outstanding += o.amount;
    }
    return outstanding; // [CHANGE] 수정된 값 반환
  }

  // recordDueDate, printDetails, printBanner 구현 메서드는 생략 
}
```

##### STEP 6
``` javascript
function printingOwing(invoice) {
  
  printBanner();

  // 미해결 채무(outstanding)를 계산한다.
  let outstanding = calculateOutstanding(invoice);  // [CHANGE] 함수 추출 완료. 추출한 함수가 반환한 값을 원래 변수에 저장한다.
  recordDueDate(invoice);
  printDetails();

  function calculateOutstanding(invoice) {
    let outstanding = 0;
    for (const o of invoice.orders) {
      outstanding += o.amount;
    }
    return outstanding;
  }

  // recordDueDate, printDetails, printBanner 구현 메서드는 생략 
}
```

##### STEP 7
``` javascript
function printingOwing(invoice) {
  
  printBanner();

  // 미해결 채무(outstanding)를 계산한다.
  const outstanding = calculateOutstanding(invoice); // [CHANGE] 반환 값 이름을 내 코딩 스타일에 맞게 바꾼다.
  recordDueDate(invoice);
  printDetails();

  function calculateOutstanding(invoice) {
    let result = 0; // [CHANGE] 반환 값 이름을 내 코딩 스타일에 맞게 바꾼다.
    for (const o of invoice.orders) {
      result += o.amount;
    }
    return result;
  }

  // recordDueDate, printDetails, printBanner 구현 메서드는 생략 
}
```

### 6.2 함수 인라인하기(Inline Function)
#### BEFORE
``` javascript
function getRating(driver) {
  return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}

function moreThanFiveLateDeliveries(driver) {
  return driver.numberOfLateDeliveries > 5;
}
```
#### AFTER
``` javascript
function getRating(driver) {
  return driver.numberOfLateDeliveries > 5;
}
```

### 6.3 변수 추출하기(Extract Variable)
#### BEFORE
``` javascript
return order.quantity * order.itemPrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(order.quantity * order.itemPrice * 0.1, 100)
```
#### AFTER
``` javascript
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(basePrice * 0.1, 100);
return basePrice - quantityDiscount + shipping;
```

#### 배경
- 표현식이 너무 복잡해서 이해하기 어려울 수 있다. 이럴 때 지역 변수를 활용하면 표현식을 쪼개 관리하기 더 쉽게 만들 수 있다. 그러면 복잡한 로직을 구성하는 단계마다 이름을 붙일 수 있어서 코드의 목적을 훨씬 명확하게 드러낼 수 있다.

#### 절차
1. 추출하려는 표현식에 부작용은 없는지 확인한다.
2. 불변 변수를 하나 선언하고 이름을 붙일 표현식의 복제본을 대입한다.
3. 원본 표현식을 새로 만든 변수로 교체한다.
4. 테스트한다.
5. 표현식을 여러 곳에 사용한다면 각각을 새로 만든 변수로 교체한다. 하나 교체할 때마다 테스트한다.

#### 예시
##### STEP 0(원본 소스)
``` javascript
function price(order) {
  // 가격(price) = 기본 가격(basePrice) - 수량 할인(quantityDiscount) + 배송비(shipping)
  return order.quantity * order.itemPrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(order.quantity * order.itemPrice * 0.1, 100);
}
```
##### STEP 1
``` diff
function price(order) {
  // 가격(price) = 기본 가격(basePrice) - 수량 할인(quantityDiscount) + 배송비(shipping)
+ const basePrice = order.quantity * order.itemPrice; // [CHANGE] 로직을 이해하고 이를 담을 변수와 적절한 이름을 지어준다
  return order.quantity * order.itemPrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(order.quantity * order.itemPrice * 0.1, 100);
}
```
- 기본가격(basePrice)를 추출한다

##### STEP 2
``` diff
function price(order) {
  // 가격(price) = 기본 가격(basePrice) - 수량 할인(quantityDiscount) + 배송비(shipping)
  const basePrice = order.quantity * order.itemPrice;
- return order.quantity * order.itemPrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(order.quantity * order.itemPrice * 0.1, 100);  
+ return basePrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(order.quantity * order.itemPrice * 0.1, 100);
}
```
- basePrice의 로직을 사용하는 부분을 교체한다

##### STEP 3
``` diff
function price(order) {
  // 가격(price) = 기본 가격(basePrice) - 수량 할인(quantityDiscount) + 배송비(shipping)
  const basePrice = order.quantity * order.itemPrice;
- return basePrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(order.quantity * order.itemPrice * 0.1, 100);
+ return basePrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(basePrice * 0.1, 100);
}
```
- basePrice의 로직을 사용하는 부분을 추가 교체한다

##### STEP 4
``` diff
function price(order) {
  // 가격(price) = 기본 가격(basePrice) - 수량 할인(quantityDiscount) + 배송비(shipping)
  const basePrice = order.quantity * order.itemPrice;
+ const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
- return basePrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(basePrice * 0.1, 100);
+ return basePrice - quantityDiscount + Math.min(basePrice * 0.1, 100);
}
```
- 수량 할인(quantityDiscount)를 추출하고 교체한다

##### STEP 5
``` diff
function price(order) {
- // 가격(price) = 기본 가격(basePrice) - 수량 할인(quantityDiscount) + 배송비(shipping)
  const basePrice = order.quantity * order.itemPrice;
  const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
+ shipping = Math.min(basePrice * 0.1, 100);
- return basePrice - quantityDiscount + Math.min(basePrice * 0.1, 100);
+ return basePrice - quantityDiscount + shipping;
}
```
- 배송비(shipping)를 추출하고 교체한다

#### 예시: 클래스 안에서
##### STEP 0
``` javascript
class Order {
  constructor(aRecord) {
    this._data = aRecord;
  }

  get quantity() { return this._data.quantity; }
  get itemPrice() { return this._data.itemPrice; }

  get price() {
    return this.quantity * this.itemPrice - Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 + Math.min(this.quantity * this.itemPrice * 0.1, 100);
  }
}
```
- 클래스 전체에 영향을 줄 때는 변수가 아닌 메서드로 추출한다
##### STEP 1
``` diff
class Order {
  constructor(aRecord) {
    this._data = aRecord;
  }

  get quantity() { return this._data.quantity; }
  get itemPrice() { return this._data.itemPrice; }

  get price() {
-   return this.quantity * this.itemPrice - Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 + Math.min(this.quantity * this.itemPrice * 0.1, 100);
+   return this.basePrice  - this.quantityDiscount + this.shipping;
  }
+ get basePrice() { return this.quantity * this.itemPrice; }
+ get quantityDiscount() { return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05; }
+ get shipping() { return Math.min(this.basePrice * 0.1, 100); }
}
```
- 여기서 객체의 장점을 볼 수 있다. 객체는 특정 로직과 데이터를 외부와 공유하려 할 때 공유할 정보를 설명해주는 적당한 크기의 문맥이 되어준다.

### 6.4 변수 인라인하기(Inline Variable)
- 반대 리팩터링: [6.3 변수 추출하기]()
``` diff
- let basePrice = anOrder.basePrice;
- return (basePrice > 1000);
+ return (anOrder.basePrice > 1000);
```

#### 배경
- 이름이 원래 표현식과 다르지 않을 경우 변수 인라인을 적용한다. 혹은 변수가 주변 코드를 리팩터링하는 데 방해가 되는 경우도 변수 인라인을 적용한다.
#### 절차
1. 대입문의 우변(표현식)에서 부작용이 생기지는 않는지 확인한다.
2. 변수가 불변으로 선언되지 않았다면 불변으로 만든 후에 테스트한다. 이렇게 하면 변수에 값이 단 한 번만 대입되는지 확인할 수 있다.
3. 이 변수를 가장 처음 사용하는 코드를 찾아서 대입문 우변의 코드로 바꾼다.
4. 테스트한다.
5. 변수를 사용하는 부분을 모두 교체할 때까지 이 과정을 반복한다.
6. 변수 선언문과 대입문을 지운다.
7. 테스트한다.

### 6.5 함수 선언 바꾸기(Change Function Declaration)
- 다른 이름
  - 함수 이름 바꾸기
  - 시그니처 바꾸기
``` diff
- function circum(radius) {...}
+ function circumference(radius) {...}
```
#### 배경
- 함수는 프로그램을 작은 부분으로 나누는 주된 수단이다. 함수 선언은 각 부분이 서로 맞물리는 방식을 표현하며, 실직적으로 소프트웨어 시스템의 구성 요소를 조립하는 연결부 역할을 한다. 연결부를 잘 정의하면 시스템에 새로운 부분을 추가하기가 쉬워지는 반면, 잘못 정의하면 지속적인 방해 요인으로 작용하여 소프트웨어 동작을 파악하기 어려워지고 요구사항이 바뀔 때 적절히 수정하기 어렵게 한다.
- 이러한 연결부에서 가장 중요한 요소는 함수의 이름이다. 이름이 좋으면 함수의 구현 코드를 살펴볼 필요 없이 호출문만 보고도 무슨 일을 하는지 파악할 수 있다.
- 이름이 잘못된 함수를 발견하면 더 나은 이름이 떠오르는 즉시 바꾼다. 그래야 나중에 그 코드를 다시 볼 때 무슨 일을 하는지 '또' 고민하지 않게 된다.
> 좋은 이름을 떠올리는 데 효과적인 방법이 하나 있다. 바로 주석을 이용해 함수의 목적을 설명해보는 것이다. 그러다 보면 주석이 멋진 이름으로 바뀌어 되돌아올 때가 있다.
- 매개변수(파라미터)는 함수가 외부 세계와 어우러지는 방식을 정의한다.매개변수는 함수를 사용하는 문맥을 설정한다.
- 어떻게 함수와 매개변수를 연결하는 것이 더 나은지 더 코드를 잘 이해하게 될 때마다 그에 맞게 코드를 개선할 수 있도록 함수 선언 바꾸기 리팩터링과 친숙해져야 한다.

#### 절차
- 이 리팩터링을 할 때는 먼저 변경 사항을 살펴보고 함수 선언과 호출문들을 단번에 고칠 수 있을지 가늠해본다. 가능할 것 같다면 간단한 절차를 따른다. 
- 마이그레이션 절차를 적용하면 호출문들을 점진적으로 수정할 수 있다. 호출하는 곳이 많거나, 호출 과정이 복잡하거나, 호출 대상이 다형 메서드이거나, 선언을 복잡하게 변경할 때는 이렇게 해야 한다.

#### 간단한 절차
1. 매개변수를 제거하려거든 먼저 함수 본문에서 제거 대상 매개변수를 참조하는 곳은 없는지 확인한다.
2. 메서드 선언을 원하는 형태로 바꾼다.
3. 기존 메서드 선언을 참조하는 부분을 모두 찾아서 바뀐 형태로 수정한다.
4. 테스트한다.

#### 마이그레이션 절차
1. 이어지는 추출 단계를 수월하게 만들어야 한다면 함수의 본문을 적절히 리팩터링한다.
2. 함수 본문을 새로운 함수로 [6.1 함수 추출하기(Extract function)]() 한다.(새로 만들 함수 이름이 기존 함수와 같다면 일단 검색하기 쉬운 이름을 임시로 붙여둔다)
3. 추출한 함수에 매개변수를 추가해야 한다면 '간단한 절차'를 따라 추가한다.
4. 테스트한다.
5. 기존 함수를 [6.2 함수 인라인하기(Inline Function)]() 한다.
6. 이름을 임시로 붙여뒀다면 함수 선언 바꾸기를 한 번 더 적용해서 원래 이름으로 되돌린다.
7. 테스트한다.

- 다형성을 구현한 클래스, 즉 상속 구조 속에 있는 클래스의 메서드를 변경할 때는 다형 관계인 다른 클래스들에도 변경이 반영되어야 한다. 이때, 상황이 복잡하기 때문에 간접 호출 방식으로 우회(혹은 중간 단계로 활용)하는 방법도 쓰인다. 먼저 원하는 형태의 메서드를 새로 만들어서 원래 함수를 호출하는 전달(forward) 메서드로 활용하는 것이다. 단일 상속 구조라면 전달 메서드를 슈퍼클래스에 전달하면 해결된다.(덕 타이핑(duck typing)처럼) 슈퍼클래스와의 연결을 제공하지 않는 언어라면 전달 메서드를 모든 구현 클래스에 각각에 추가해야 한다.
- 공개된 API를 리팩터링할 때는 새 함수를 추가한 다음 리팩터링을 잠시 멈출 수 있다. 이 상태에서 예전 함수를 폐기 대상(deprecated)으로 지정하고 모든 클라이언트가 새 함수로 이전할 때까지 기다린다. 클라이언트들이 모두 이전했다는 확신이 들면 예전 함수를 지운다.

#### 예시: 함수 이름 바꾸기(간단한 절차)
##### STEP 1
``` diff
- function circum(radius) {
+ function circumference(radius) {
  return 2 * Math.PI * radius;
}
```
1. 함수 선언부터 수정
2. circum()을 호출한 곳을 모두 찾아서 circumference로 바꾼다(참고로 'circumference'는 원의 둘레를 뜻한다).

#### 예시: 함수 이름 바꾸기(마이그레이션 절차)
##### STEP 1
``` diff
function app1(radius) {
  return circum(radius);
}

function app2(radius) {
  return circum(radius);
}

function circum(radius) {
- return 2 * Math.PI * radius;
+ return circumference(radius);
}

+function circumference(radius) {
+ return 2 * Math.PI * radius;
+}
```
1. 함수 본문 전체를 [6.1 함수 추출하기(Extract function)]()
2. 수정한 코드를 테스트
##### STEP 2
``` diff
function app1(radius) {
- return circum(radius);
+ return circumference(radius);
}

function app2(radius) {
  return circum(radius);
}

function circum(radius) {
  return circumference(radius);
}

function circumference(radius) {
  return 2 * Math.PI * radius;
}
```
1. 예전 함수를 [6.2 함수 인라인하기(Inline Function)](). 그러면 예전 함수를 호출하는 부분이 모두 새 함수를 호출하도록 바뀐다.
2. 하나를 변경할 때마다 테스트하면서 한 번에 하나씩 처리하자.

##### STEP 3
``` diff
function app1(radius) {
  return circumference(radius);
}

function app2(radius) {
- return circum(radius);
+ return circumference(radius);
}

-function circum(radius) {
- return circumference(radius);
-}

function circumference(radius) {
  return 2 * Math.PI * radius;
}
```
1. 모두 바꿨다면 기존 함수(circum)를 삭제한다

#### 예시: 매개변수 추가하기
``` javascript
class Book {
  addReservation(customer) {
    this._reservation.push(customer)
  }
}
```
- 예약 시 우선순위 큐를 지원하라는 새로운 요구가 추가되었다. 그래서 addReservation()을 호출할 때 예약 정보를 일반 큐에 넣을지 우선순위 큐에 넣을지를 지정하는 매개변수를 추가하려 한다. 여기서는 모두 찾고 고치기가 쉽지 않아서 마이그레이션 절차대로 진행한다.
##### STEP 1
``` diff
class Book {
  addReservation(customer) {
-   this._reservation.push(customer)
+   this.zz_addReservation(customer)
  }

+ zz_addReservation(customer) {
+   this._reservation.push(customer)
+ }
}
```
1. (2)addReservation()의 본문을 [6.1 함수 추출하기(Extract function)](). 새로 추출한 함수 이름도 addReservation()이어야 하지만, 기존 함수와 이름이 같은 상태로 둘 수는 없으니 우선은 나중에 찾기 쉬운 임시 이름을 붙인다.

##### STEP 2
``` diff
class Book {
  addReservation(customer) {
-   this.zz_addReservation(customer)
+   this.zz_addReservation(customer, false)
  }

- zz_addReservation(customer) {
+ zz_addReservation(customer, isPriority) {  
    this._reservation.push(customer)
  }
}
```
1. (3)새 함수의 선언문과 호출문에서 원하는 매개변수를 추가한다.
##### STEP 3
``` diff
class Book {
  addReservation(customer) {
    this.zz_addReservation(customer, false)
  }

  zz_addReservation(customer, isPriority) {  
+   assert(isPriority === true || isPriority === false)
    this._reservation.push(customer)
  }
}
```
1. 호출문을 변경하기 전에 [10.6 assertion을 추가]()하여 호출하는 곳에서 새로 추가한 매개변수를 실제로 사용하는지 확인한다. 이렇게 해두면 호출문을 수정하는 과정에서 실수로 새 매개변수를 빠뜨린 부분을 찾는 데 도움이 된다.
2. (5)이제 기존 함수를 [6.2 함수 인라인하기(Inline Function)]()하여 호출 코드들이 새 함수를 이용하도록 고친다. 호출문은 한 번에 하나씩 변경한다.
3. (6)다 고쳤다면 새 함수의 이름을 기존 함수의 이름으로 바꾼다.

#### 예시: 매개변수를 속성으로 바꾸기
``` javascript
function inNewEngland(aCustomer) {
  return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(aCustomer.address.state);
}

// 호출문
const newEnglanders = someCustomers.filter(c => inNewEngland(c));
```
- 고객이 뉴잉글랜드에 살고 있는지 확인하는 함수
- 주(state) 식별 코드를 매개변수로 받도록 리팩터링할 것이다. 그러면 고객에 대한 의존성이 제거되어 더 넓은 문맥에서 활용할 수 있기 때문이다.
##### STEP 1
``` diff
function inNewEngland(aCustomer) {
+ const stateCode = aCustomer.address.state;
- return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(aCustomer.address.state);
+ return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(stateCode);
}
```
- (1)함수 본문을 살짝 리팩토링해두면 이후 작업이 더 수월해진다. 그러므로 매개변수로 사용할 코드를 [6.3 변수 추출하기(Extract Variable)]()해둔다.
##### STEP 2
``` diff
function inNewEngland(aCustomer) {
  const stateCode = aCustomer.address.state;
- return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(stateCode);
+ return xxNewEngland(stateCode);
}

+function xxNewEngland(stateCode) {
+ return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(stateCode);
+}
```
- [6.1 함수 추출하기(Extract function)]()로 새 함수를 만든다.
##### STEP 3
``` diff
function inNewEngland(aCustomer) {
- const stateCode = aCustomer.address.state;
- return xxNewEngland(stateCode);
+ return xxNewEngland(aCustomer.address.state);
}
```
- 기존 함수 안에 변수로 추출해둔 입력 매개변수를 [6.4 변수 인라인하기(Inline Variable)]()한다.
##### STEP 4
``` diff
function inNewEngland(aCustomer) {
  return xxNewEngland(aCustomer.address.state);
}

function xxNewEngland(stateCode) {
  return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(stateCode);
}

// 호출문
-const newEnglanders = someCustomers.filter(c => inNewEngland(c));
+const newEnglanders = someCustomers.filter(c => xxNewEngland(aCustomer.address.state));
```
- [6.2 함수 인라인하기(Inline Function)]()로 기존 함수의 본문을 호출문들에 집어 넣는다. 실질적으로 기존 함수 호출문을 새 함수 호출문으로 교체하는 셈이다. 이 작업은 한 번에 하나씩 처리한다.

##### STEP 5
``` diff
-function inNewEngland(aCustomer) {
- return xxNewEngland(aCustomer.address.state);
-}

-function xxNewEngland(stateCode) {
+function inNewEngland(stateCode) {
  return ["MA", "CT", "ME", "VT", "NH", "RI"].includes(stateCode);
}

// 호출문
-const newEnglanders = someCustomers.filter(c => xxNewEngland(aCustomer.address.state));
+const newEnglanders = someCustomers.filter(c => inNewEngland(aCustomer.address.state));
```
- 기존 함수를 모든 호출문에 인라인했다면, (6)함수 선언 바꾸기를 다시 한번 적용하여 새 함수의 이름을 기존 함수의 이름으로 바꾼다.

### 6.6 변수 캡슐화하기(Encapsulate Variable)
``` diff
-let defaultOwner = { firstName: "마틴", lastName: "파울러" };
+let defaultOwnerData = { firstName: "마틴", lastName: "파울러" };
+export function defaultOwner() { return defaultOwnerData; }
+export function setDefaultOwner(arg) { defaultOwnerData = arg; }
```
#### 배경
- 데이터는 함수보다 다루기 까다롭다. 데이터를 참조하는 모든 부분을 한 번에 바꿔야 코드가 제대로 작동한다. 짧은 함수 안의 임시 변수처럼 유효범위가 아주 좁은 데이터는 어려울 게 없지만, 유효범위가 넓어질수록 다루기 어려워진다. 전역 데이터가 골칫거리인 이유도 바로 여기에 있다.
- 그래서 접근할 수 있는 범위가 넓은 데이터를 옮길 때는 먼저 그 데이터로의 접근을 독점하는 함수를 만드는 식으로 캡슐화하는 것이 가장 좋은 방법일 때가 많다. 데이터 재구성이라는 어려운 작업을 함수 재구성이라는 더 단순한 작업으로 바꾸는 것이다.
- 데이터 캡슐화는 다른 경우에도 도움을 준다. 데이터를 변경하고 사용하는 코드를 감시할 수 있는 확실한 통로가 되어주기 때문에 데이터 변경 전 검증이나 변경 후 추가 로직을 쉽게 끼워 넣을 수 있다. 필자는 유효범위가 함수 하나보다 넓은 가변 데이터는 모두 이런 식으로 캡슐화해서 그 함수를 통해서만 접근하게 만드는 습관이 있다. 데이터의 유효범위가 넓을 수록 캡슐화해야 한다.레거시 코드를 다룰 때는 이런 변수를 참조하는 코드를 추가하거나 변경할 때마다 최대한 캡슐화한다. 그래야 자주 사용하는 데이터에 대한 결합도가 높아지는 일을 막을 수 있다.
- 불변 데이터는 가변 데이터보다 캡슐화할 이유가 적다. 데이터가 변경될 일이 없어서 갱신 전 검증 같은 추가 로직이 자리할 공간을 마련할 필요가 없기 때문이다. 불변성은 강력한 방부제인 셈이다.
#### 절차
1. 변수로의 접근과 갱신을 전담하는 캡슐화 함수들을 만든다.
2. 정적 검사를 수행한다.
3. 변수를 직접 참조하던 부분을 모두 적절한 캡슐화 함수 호출로 바꾼다. 하나씩 바꿀 때마다 테스트한다.
4. 변수의 접근 범위를 제한한다. 
  - 변수로의 직접 접근을 막을 수 없을 때도 있다. 그럴 때는 변수 이름을 바꿔서 테스트해보면 해당 변수를 참조하는 곳을 쉽게 찾아낼 수 있다.
5. 테스트한다.
6. 변수 값이 레코드라면 [7.1 레코드 캡슐화하기]()를 적용할지 고려해본다.
#### 예시
``` javascript
// 전역 변수에 중요한 데이터가 있는 경우
let defaultOwner = { firstName: "마틴", lastName: "파울러" };
// 데이터를 참조하는 코드
spaceship.owner = defaultOwner;
// 데이터를 갱신하는 코드
defaultOwner = { firstName: "레베카", lastName: "파슨스" };
```
##### STEP 1
``` diff
+function getDefaultOwner() { return defaultOwner; }
+function setDefaultOwner(arg) { defaultOwner = arg; }
```
- (1)기본적인 캡슐화를 위해 가장 먼저 데이터를 읽고 쓰는 함수부터 정의한다.

##### STEP 2
``` diff
// 데이터를 참조하는 코드
-spaceship.owner = defaultOwner;
+spaceship.owner = getDefaultOwner();
// 데이터를 갱신하는 코드
-defaultOwner = { firstName: "레베카", lastName: "파슨스" };
+setDefaultOwner({ firstName: "레베카", lastName: "파슨스" });
```
- (2)그런 다음 defaultOwner를 참조하는 코드를 찾아서 방금 만든 getter 함수를 호출하도록 고친다.
- 대입문은 setter 함수로 바꾼다.
- 하나씩 바꿀 때마다 테스트한다.

##### STEP 3
``` diff
// defaultOwner.js 파일
+let defaultOwner = { firstName: "마틴", lastName: "파울러" };
+export function getDefaultOwner() { return defaultOwner; }
+export function setDefaultOwner(arg) { defaultOwner = arg; }
```
- (4)모든 참조를 수정했다면 이제 변수의 가시 범위를 제한한다. 그러면 미처 발견하지 못한 참조가 없는지 확인할 수 있고, 나중에 수정하는 코드에서도 이 변수에 직접 접근하지 못하게 만들 수 있다. 자바스크립트로 작성할 때는 변수와 접근자 메서드를 같은 파일로 옮기고 접근자만 노출(export) 시키면 된다.
- 변수로의 접근을 제한할 수 없을 때는 변수 이름을 바꿔서 다시 테스트해보면 좋다. 이렇게 한다고 해서 나중에 직접 접근하지 못하게 막을 수 있는 건 아니지만, `__privateOnly_defaultOwner`처럼 공개용이 아니라는 의미를 담으면서도 눈에 띄는 이름으로 바꾸면 조금이나마 도움이 된다.

#### 값 캡슐화하기
``` javascript
const owner1 = defaultOwner();
assert.equal("파울러", owner1.lastName, "처음 값 확인");
const owner2 = defaultOwner();
owner2.lastName = "파슨스";
assert.equal("파슨스", owner1.lastName, "owner2를 변경한 후"); // 성공할까?
```
- 변수에 담긴 내용을 행위까지 제어할 수 있게 캡슐화하고 싶을 때도 많다.
##### 첫번째 방법
``` diff
// defaultOwner.js
let defaultOwner = { firstName: "마틴", lastName: "파울러" };
-export function getDefaultOwner() { return defaultOwner; }
+export function getDefaultOwner() { return Object.assign({}, defaultOwner); }
export function setDefaultOwner(arg) { defaultOwner = arg; }
```
- getter가 데이터의 복제본을 돌려주는 방식으로 처리. 리스트에 이 기법을 많이 적용한다. 데이터의 복제본을 돌려주면 클라이언트는 getter로 얻은 데이터를 변경할 수 있지만 원본에는 아무런 영향을 주지 못한다. 
##### 두번째 방법
``` diff
// defaultOwner.js
let defaultOwner = { firstName: "마틴", lastName: "파울러" };
-function getDefaultOwner() { return defaultOwner; }
+function getDefaultOwner() { return new Person(defaultOwner); }
function setDefaultOwner(arg) { defaultOwner = arg; }

+class Person {
+ constructor(data) {
+   this._lastName = data.lastName;
+   this._firstName = data.firstName;
+ }
+ get lastName() { return this._lastName; }
+ get firstName() { return this._firstName; }
+ // 다른 속성도 이런 식으로 처리한다.
+}
```
- 아예 변경할 수 없게 만들려면, [7.1 레코드 캡슐화하기]()를 사용한다
- 이렇게 하면 defaultOwnerData의 속성을 다시 대입하는 연산은 모두 무시된다.
- 이처럼 변경을 감지하여 막는 기법을 임시로 활용해보면 도움될 때가 많다. 변경하는 부분을 없앨 수도 있고, 적절한 변경 함수를 제공할 수도 있다. 적절히 다 처리하고 난 뒤 게터가 복제본을 반환하도록 수정하면 된다.
- setter에서도 복제본을 만드는 편이 좋을 수 있다. 정확한 기준은 그 데이터가 어디서 오는지, 원본 데이터의 모든 변경을 그대로 반영할 수 있도록 원본으로의 링크를 유지해야 하는지에 따라 다르다. 링크가 필요없다면 데이터를 복제해 저장하여 나중에 원본이 변경돼서 발생하는 사고를 방지할 수 있다. 복제본 만들기가 번거로울 때가 많지만, 이런 복제가 성능에 주는 영향은 대체로 미미하다. 반면, 원본을 그대로 사용하면 나중에 디버깅하기 어렵고 시간도 오래 걸릴 위험이 있다.

### 6.7 변수 이름 바꾸기(Rename Variable)
```diff
-let a = height * width;
+let area = height * width;
```
- 함수 호출 한 번으로 끝나지 않고 값이 영속되는 필드라면 이름에 더 신경을 써야한다. 필자가 가장 신중하게 이름 짓는 대상이 바로 이런 필드들이다.
#### 절차
1. 폭넓게 쓰이는 변수라면 [6.6 변수 캡슐화하기(Encapsulate Variable)]()를 고려한다.
2. 이름을 바꿀 변수를 참조하는 곳을 모두 찾아서, 하나씩 변경한다.
  - 다른 코드베이스에서 참조하는 변수는 외부에 공개된 변수이므로 이 리팩토링을 적용할 수 없다
  - 변수 값이 변하지 않는다면 다른 이름으로 복제본을 만들어서 하나씩 점진적으로 변경한다. 하나씩 바꿀 때마다 테스트한다.
3. 테스트한다.
#### 예시
``` javascript
let tpHd = "untitled";
// 변수를 읽기만 하는 참조
result += `<h1>${tpHd}</h1>`;
// 값을 수정
tpHd = obj['articleTitle'];
```
##### STEP 1
``` diff
let tpHd = "untitled";
// 변수를 읽기만 하는 참조
-result += `<h1>${tpHd}</h1>`;
+result += `<h1>${title()}</h1>`;
// 값을 수정
-tpHd = obj['articleTitle'];
+setTitle(obj['articleTitle']);

// tpHd 변수의 getter
+function title() { return tpHd; }
// tpHd 변수의 setter
+function setTitle(arg) { tpHd = arg; }
```
- (1)[6.6 변수 캡슐화하기(Encapsulate Variable)]()로 처리함
##### STEP 2
``` diff
-let tpHd = "untitled";
+let _title = "untitled";
// 변수를 읽기만 하는 참조
result += `<h1>${title()}</h1>`;
// 값을 수정
setTitle(obj['articleTitle']);

// tpHd 변수의 getter
-function title() { return tpHd; }
+function title() { return _title; }
// tpHd 변수의 setter
-function setTitle(arg) { tpHd = arg; }
+function setTitle(arg) { _title = arg; }
```
- 캡슐화 이후에는 변수 이름을 바꿔도 된다
#### 예시: 상수 이름 바꾸기
``` diff
-const cpyNm = "애크미 구스베리";
+const copyName = "애크미 구스베리";
+const cpyNm = copyName;
```
- (2)상수의 이름은 캡슐화하지 않고도 복제 방식으로 점진적으로 바꿀 수 있다.
- 먼저 원본의 이름을 바꾼 후, 원본의 원래 이름과 같은 복제본을 만든다.
- 이제 기존 이름을 참조하는 코드들을 새 이름으로 점진적으로 바꿀 수 있다. 다 바꿨다면, 복제본을 삭제한다.
- 이 방식은 읽기 전용인 변수에도 적용할 수 있다.

### 6.8 매개변수 객체 만들기(Introduce Parameter Object)
``` diff
-function amountInvoiced(startDate, endDate) {...}
-function amountReceived(startDate, endDate) {...}
-function amountOverdue(startDate, endDate) {...}
+function amountInvoiced(aDateRange) {...}
+function amountReceived(aDateRange) {...}
+function amountOverdue(aDateRange) {...}
```

#### 배경
- 데이터 뭉치를 데이터 구조로 묶으면 데이터 사이의 관계가 명확해진다는 이점을 얻는다. 게다가 함수가 이 데이터 구조를 받게 하면 매개변수가 줄어든다. 같은 데이터 구조를 사용하는 모든 함수가 원소를 참조할 때 항상 똑같은 이름을 사용하기 때문에 일관성도 높여준다.
- 이 리팩터링의 진정한 힘은 코드를 더 근본적으로 바꿔준다는 데 있다. 나는 이런 데이터 구조를 새로 발견하면 이 데이터 구조를 활용하는 형태로 프로그램 동작을 재구성한다.데이터 구조에 담길 데이터에 공통으로 적용되는 동작을 추출해서 함수로 만드는 것이다(공용 함수를 나열하는 식으로 작성할 수도 있고, 이 함수들과 데이터를 합쳐서 클래스로 만들 수도 있다).
- 이 과정에서 새로 만든 데이터 구조가 문제 영역을 훨씬 간결하게 표현하는 새로운 추상 개념으로 격상되면서, 코드의 개념적인 그림을 다시 그릴 수도 있다. 그러면 놀라울 정도로 강력한 효과를 낸다. 하지만 이 모든 것의 시작은 매개변수 객체 만들기부터다.
#### 절차
1. 적당한 데이터 구조가 아직 마련되어 있지 않다면 새로 만든다
  - 개인적으로 클래스로 만드는 걸 선호한다. 나중에 동작까지 함께 묶기 좋기 때문이다. 나는 주로 데이터 구조를 값 객체(Value Object)로 만든다
2. 테스트한다.
3. [6.5 함수 선언 바꾸기(Change Function Declaration)]()로 새 데이터 구조를 매개변수로 추가한다.
4. 테스트한다.
5. 함수 호출 시 새로운 데이터 구조 인스턴스를 넘기도록 수정한다. 하나씩 수정할 때마다 테스트한다.
6. 기존 매개변수를 사용하던 코드를 새 데이터 구조의 원소를 사용하도록 바꾼다.
7. 다 바꿨다면 기존 매개변수를 제거하고 테스트한다.
#### 예시
``` javascript
// 온도 측정값을 표현하는 데이터
const station = {
  name: "ZB1",
  readings: [
    { temp: 47, time: "2016-11-10 09:10" },
    { temp: 53, time: "2016-11-10 09:20" },
    { temp: 58, time: "2016-11-10 09:30" },
    { temp: 53, time: "2016-11-10 09:40" },
    { temp: 51, time: "2016-11-10 09:50" },
  ],
}
// 정상 범위를 벗어난 측정값을 찾는 함수
function readingsOutsideRange(station, min, max) {
  return station.readings.filter(r => r.temp < min || r.temp > max);
}
// 호출문
alert = readingsOutsideRange(
  station, 
  operatingPlan.temperatureFloor, // 최저 온도
  operatingPlan.temperatureCeiling, // 최고 온도
)
```
- 호출 코드를 보면 operatingPlan의 데이터 항목 두 개를 쌍으로 가져와서 `readingOutsideRange()`로 전달한다. 그리고 operatingPlan은 범위의 시작과 끝 이름을 `readingOutsideRange()`와 다르게 표현한다. 이와 같은 범위(Range)라는 개념은 객체 하나로 묶어 표현하는 게 나은 대표적인 예다
##### STEP 1
```diff
+class NumberRange {
+ constructor(min, max) {
+   this._data = { min: min, max: max };    
+ }
+ get min() { return this._data.min; }
+ get max() { return this._data.max; }
+}
```
- (1)묶을 데이터를 표현하는 클래스부터 선언하자.
- 값 객체로 만들 가능성이 높기 때문에 setter는 만들지 않는다.
##### STEP 2
```diff
// 정상 범위를 벗어난 측정값을 찾는 함수
-function readingsOutsideRange(station, min, max) {
+function readingsOutsideRange(station, min, max, range) {  
  return station.readings.filter(r => r.temp < min || r.temp > max);
}
// 호출문
alert = readingsOutsideRange(
  station, 
  operatingPlan.temperatureFloor, // 최저 온도
  operatingPlan.temperatureCeiling, // 최고 온도
+ null,  
)
```
- (3)새로 만든 객체를 `readingsOutsideRange()`의 매개변수로 추가하도록 [6.5 함수 선언 바꾸기(Change Function Declaration)]()
- 새 매개변수 자리에 null을 적어둔다.
- (4)아직까지 동작은 하나도 바꾸지 않았으니 테스트는 통과할 것이다.
##### STEP 3
```diff
// 호출문
+const range = new NumberRange(operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling);
alert = readingsOutsideRange(
  station, 
  operatingPlan.temperatureFloor, // 최저 온도
  operatingPlan.temperatureCeiling, // 최고 온도
- null,
+ range,
)
```
- (5)이제 온도 범위를 객체 형태로 전달하도록 호출문을 하나씩 바꾼다.
- 이번에도 테스트를 무난히 통과한다.
##### STEP 4
```diff
-function readingsOutsideRange(station, min, max, range) {  
+function readingsOutsideRange(station, min, range) {
- return station.readings.filter(r => r.temp < min || r.temp > max);
+ return station.readings.filter(r => r.temp < min || r.temp > range.max);
}

// 호출문
const range = new NumberRange(operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling);
alert = readingsOutsideRange(
  station, 
  operatingPlan.temperatureFloor, // 최저 온도
- operatingPlan.temperatureCeiling, // 최고 온도
  range,
)
```
- (6)이제 기존 매개변수를 사용하는 부분을 변경한다. 최대값부터 바꿔보자.
##### STEP 5
``` diff
-function readingsOutsideRange(station, min, range) {
+function readingsOutsideRange(station, range) {
- return station.readings.filter(r => r.temp < min || r.temp > range.max);
+ return station.readings.filter(r => r.temp < range.min || r.temp > range.max);
}

// 호출문
const range = new NumberRange(operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling);
alert = readingsOutsideRange(
  station, 
- operatingPlan.temperatureFloor, // 최저 온도
  range,
)
```
- 다음 매개변수도 제거한다.
##### STEP 6
``` diff
function readingsOutsideRange(station, range) {
- return station.readings.filter(r => r.temp < range.min || r.temp > range.max);  
+ return station.readings.filter(r => !range.contains(r.temp));
}

class NumberRange {
  constructor(min, max) {
    this._data = { min: min, max: max };    
  }
  get min() { return this._data.min; }
  get max() { return this._data.max; }
+ contains(arg) { return (arg >= this.main && arg <= this.max); }
}
```
- 클래스로 만들어두면 관련 동작들을 이 클래스로 옮길 수 있다는 이점이 생긴다.이 예에서는 온도가 허용 범위 안에 있는지 검사하는 메서드를 클래스에 추가할 수 있다. 지금까지 한 작업은 여러 가지 유용한 동작을 갖춘 범위(Range) 클래스를 생성하기 위한 첫 단계다.

### 6.9 여러 함수를 클래스로 묶기(Combine Functions into Class)
``` diff
-function base(aReading) {...}
-function texableCharge(aReading) {...}
-function calculateBaseCharge(aReading) {...}
+class Reading {
+ base() {...}
+ texableCharge() {...}
+ calculateBaseCharge() {...}
+}
```
#### 배경
- 클래스는 데이터와 함수를 하나의 공유 환경으로 묶은 후, 다른 프로그램 요소와 어우러질 수 있도록 그 중 일부를 외부에 제공한다.
- 클래스로 묶으면 이 함수들이 공유하는 공통 환경을 더 명확하게 표현할 수 있고, 각 함수에 전달되는 인수를 줄여서 객체 안에서의 함수 호출을 간결하게 만들 수 있다. 또한 이런 객체를 시스템의 다른 부분에 전달하기 위한 참조를 제공할 수 있다.
- 이 리팩터링은 이미 만들어진 함수들을 재구성할 때는 물론, 새로 만든 클래스와 관련하여 놓친 연산을 찾아서 새 클래스의 메서드로 뽑아내는 데도 좋다.
#### 절차
1. 함수들이 공유하는 공통 데이터 레코드를 [7.1 캡슐화]()한다.
  - 공통 데이터가 레코드 구조로 묶여 있지 않다면 먼저 [6.8 매개변수 객체 만들기(Introduce Parameter Object)]()로 데이터를 하나로 묶는 레코드를 만든다.
2. 공통 레코드를 사용하는 함수 각각을 새 클래스로 옮긴다([8.1 함수 옮기기]())
  - 공통 레코드의 멤버는 함수 호출문의 인수 목록에서 제거한다.
3. 데이터를 조작하는 로직들은 [6.1 함수 추출하기(Extract function)]()로 새 클래스로 옮긴다.
#### 예시
``` javascript
reading = { customer: "ivan", quantity: 10, month: 5, year: 2017 };
// Client 1
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
// Client 2
const aReading = acquireReading();
const base = (baseRate(aReading.month, aReading.year) * aReading.quantity);
const taxableCharge = Math.max(0, base - taxThresold(aReading.year));
// Client 3
const aReading = acquireReading();
const basicChargeAmount = calculateBaseCharge(aReading);

function calculateBaseCharge(aReading) { // 기본 요금 계산 함수
  return baseRate(aReading.month, aReading.year) * aReading.quantity;
}
```
- 사람들은 매달 차 계량기를 읽어서 측정값(reading)을 위와 같이 기록한다고 치자.
- 이런 레코드를 처리하는 코드를 훑어보니 이 데이터로 비슷한 연산을 수행하는 부분이 상당히 많았다. 그래서 기본요금을 계산하는 코드를 찾아봤다.
- 이런 코드를 보면 앞의 두 클라이언트(Client 1,2)도 이 함수를 사용하도록 고칠 것이다. 하지만 이렇게 최상위 함수로 두면 못보고 지나치기 쉽다는 문제가 있다. 이런 함수를 데이터 처리 코드 가까이 두어야 한다. 그러기 위한 좋은 방법으로, 데이터를 클래스로 만들 수 있다.
##### STEP 1
``` diff
+class Reading {
+ constructor() {
+   this._customer = data.customer;
+   this._quantity = data.quantity;
+   this._month = data.month;
+   this._year = data.year;
+ }
+ get customer() { return this._customer; }
+ get quantity() { return this._quantity; }
+ get month() { return this._month; }
+ get year() { return this._year; }
+}
```
- (1)레코드를 클래스로 바꾸기 위해 [7.1 레코드를 캡슐화]()한다.
##### STEP 2
``` diff
// Client 3
-const aReading = acquireReading();
+const rawReading = acquireReading();
+const aReading = new Reading(rawReading);
const basicChargeAmount = calculateBaseCharge(aReading);
```
- (2)이미 만들어져 있는 `calculateBaseCharge()`부터 옮기자. 새 클래스를 사용하려면 데이터를 얻자마자 객체로 만들어야 한다.
##### STEP 3
``` diff
// Reading Class
class Reading {
  constructor() {
    this._customer = data.customer;
    this._quantity = data.quantity;
    this._month = data.month;
    this._year = data.year;
  }
  get customer() { return this._customer; }
  get quantity() { return this._quantity; }
  get month() { return this._month; }
  get year() { return this._year; }
+ get calculateBaseCharge() {
+   return baseRate(this.month, this.year) * this.quantity;
+ }  
}

// Client 3
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
-const basicChargeAmount = calculateBaseCharge(aReading);
+const basicChargeAmount = aReading.calculateBaseCharge;
```
- 그런 다음 `calculateBaseCharge()`를 새로 만든 클래스로 옮긴다([8.1 함수 옮기기]())
##### STEP 4
``` diff
// Reading Class
class Reading {
  ...
- get calculateBaseCharge() {
+ get baseCharge() {  
    return baseRate(this.month, this.year) * this.quantity;
  }
}

// Client 3
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
-const basicChargeAmount = aReading.calculateBaseCharge;
+const basicChargeAmount = aReading.baseCharge;
```
- 이 과정에서 메서드 이름을 원하는 대로 바꾼다([6.5 함수 선언 바꾸기(Change Function Declaration)]())
- 이렇게 이름을 바꾸고 나면 Reading 클래스의 클라이언트는 baseCharge가 필드인지, 계산된 값(함수 호출)인지 구분할 수 없다. 이는 [단일 접근 원칙(Uniform Access Principle)](https://martinfowler.com/bliki/UniformAccessPrinciple.html)을 따르므로 권장하는 방식이다.
##### STEP 5
``` diff
// Client 1
-const aReading = acquireReading();
+const rawReading = acquireReading();
+const aReading = new Reading(rawReading);
-const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
+const baseCharge = aReading.baseCharge;

// Client 2
-const aReading = acquireReading();
+const rawReading = acquireReading();
+const aReading = new Reading(rawReading);
-const base = (baseRate(aReading.month, aReading.year) * aReading.quantity);
-const taxableCharge = Math.max(0, base - taxThresold(aReading.year));
+const taxableCharge = Math.max(0, aReading.baseCharge - taxThresold(aReading.year));
```
##### STEP 6
``` diff
+function texableChargeFn(aReading) {
+ return Math.max(0, aReading.baseCharge - taxThreshold(aReading.year));
+}

// Client 3
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
-const basicChargeAmount = aReading.baseCharge;
+const taxableCharge = taxableChargeFn(aReading);
```
- (3)이어서 세금을 부과할 소비량을 계산하는 코드를 [6.1 함수 추출하기(Extract function)]()
##### STEP 7
``` diff
// Reading Class
class Reading {
  ...
+ get taxableCharge() {  
+   return Math.max(0, this.baseCharge - taxThreshold(this.year));
+ }
}

// Client 3
const rawReading = acquireReading();
const aReading = new Reading(rawReading);
-const taxableCharge = taxableChargeFn(aReading);
+const taxableCharge = aReading.taxableCharge;
```
- 그런 다음 방금 추출한 함수를 Reading 클래스로 옮긴다([8.1 함수 옮기기]())
- 파생 데이터 모두를 필요한 시점에 계산되게 만들었으니 저장된 데이터를 갱신하더라도 문제가 생길 일이 없다.
- 프로그램의 다른 부분에서 데이터를 갱신할 가능성이 있을 때는 클래스로 묶어두면 큰 도움이 된다.
### 6.10 여러 함수를 변환 함수로 묶기(Combine Functions into Transform)
``` diff
-function base(aReading) {...}
-function taxableCharge(aReading) {...}
+function enrichReading(argReading) {
+ const aReading = _.cloneDeep(argReading);
+ aReading.baseCharge = base(aReading);
+ aReading.taxableCharge = taxableCharge(aReading);
+ return aReading;
+}
```
- 같은 정보가 사용되는 곳마다 같은 도출 로직이 반복되기도 한다.
- 이런 도출 로직을 모아두면 검색과 갱신을 일관된 장소에서 처리할 수 있고, 로직 중복도 막을 수 있다.
- 이렇게 하기 위한 방법으로 "변환 함수(transform)"을 사용할 수 있다. 변환 함수는 원본 데이터를 입력받아서 필요한 정보를 모두 도출한 뒤, 각각을 출력 데이터의 필드에 넣어 반환한다. 이렇게 해두면 도출 과정을 검토할 일이 생겼을 때 변환 함수만 살펴보면 된다.
- 이 리팩터링 대신 [6.9 여러 함수를 클래스로 묶기(Combine Functions into Class)]()로 처리해도 된다. 둘 중 어느 것을 적용해도 좋으며, 대체로 소프트웨어에서 이미 반영된 프로그래밍 스타일을 따르는 편이다.
- [6.9 여러 함수를 클래스로 묶기(Combine Functions into Class)]()와 [6.10 여러 함수를 변환 함수로 묶기(Combine Functions into Transform)]()의 사이에는 중요한 차이가 하나 있다. 원본 데이터가 코드 안에서 갱신될 때는 클래스로 묶는 편이 훨씬 낫다. 변환 함수로 묶으면 가공한 데이터를 새로운 레코드에 저장하므로, 원본 데이터가 수정되면 일관성이 깨질 수 있기 때문이다.
- 여러 함수를 한데 묶는 이유 중 하나는 도출 로직이 중복되는 것을 피하기 위해서다. 이 로직을 [6.1 함수 추출하기(Extract function)]()하는 것 만으로도 같은 효과를 볼 수 있지만, 데이터 구조와 이를 사용하는 함수가 근처에 있지 않으면 함수를 발견하기 어려울 때가 많다. 변환 함수(또는 클래스)로 묶으면 이런 함수들을 쉽게 찾아 쓸 수 있다.
#### 절차
1. 변환할 레코드를 입력받아서 값을 그대로 반환하는 변환함수를 만든다.
  - 이 작업은 대체로 깊은 복사로 처리해야 한다. 변환 함수가 원본 레코드를 바꾸지 않는지 검사하는 테스트를 마련해두면 도움이 될 때가 많다.
2. 묶을 함수 중 함수 하나를 골라서 본문 코드를 변환 함수로 옮기고, 처리 결과를 레코드에 새 필드로 기록한다. 그런 다음 클라이언트 코드가 이 필드를 사용하도록 수정한다.
  - 로직이 복잡하다면 [6.1 함수 추출하기(Extract function)]()부터 한다.
3. 테스트한다.
4. 나머지 관련 함수도 위 과정을 따라 처리한다.
#### 예시
``` javascript
reading = { customer: "ivan", quantity: 10, month: 5, year: 2017 };
// Client 1
const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
// Client 2
const aReading = acquireReading();
const base = (baseRate(aReading.month, aReading.year) * aReading.quantity);
const taxableCharge = Math.max(0, base - taxThresold(aReading.year));
// Client 3
const aReading = acquireReading();
const basicChargeAmount = calculateBaseCharge(aReading);
// function calculateBaseCharge
function calculateBaseCharge(aReading) { // 기본 요금 계산 함수
  return baseRate(aReading.month, aReading.year) * aReading.quantity;
}
```
- 매달 사용자가 마신 차의 양을 측정(reading)
- 코드 곳곳에서 다양한 방식으로 차 소비량을 측정한다. 그 중 사용자에게 요금을 부과하기 위해 기본요금을 계산하는 코드도 있다.
- 세금을 부과할 소비량을 계산하는 코드도 필요하다. 모든 시민이 차 세금을 일부 면제받을 수 있도록 영국 정부가 사려깊게 설계하여 이 값은 기본 소비량보다 적다.
- 이 코드에는 이와 같은 계산 코드가 여러 곳에 반복된다고 해보자. 중복 코드는 나중에 로직을 수정할 때 골치를 썩인다(장담하건데 반드시 수정할 일이 생긴다). 중복 코드라면 [6.1 함수 추출하기(Extract function)]()로 처리할 수도 있지만, 추출한 함수들이 프로그램 곳곳에 흩어져서 나중에 프로그래머가 그런 함수가 있는지조차 모르게 될 가능성이 있다. 
- 이를 해결하는 방법으로, 다양한 파생 정보 계산 로직을 모두 하나의 변환 단계로 모을 수 있다.
##### STEP 1
``` diff
// function enrichReading
+function enrichReading(orignal) {
+ const result = _.cloneDeep(orignal);
+ return result;
+}
```
- 입력 객체를 그대로 복사해 반환하는 변환함수를 만든다.
> 본질은 같고 부가 정보만 덧붙이는 변환함수의 이름을 "enrich"라 하고, 형태가 변할 때만 "transform"이라는 이름을 쓴다.
##### STEP 2
``` diff
// Client 3
+const rawReading = acquireReading(); // 미가공 측정값
-const aReading = acquireReading();
+const aReading = enrichReading(rawReading);
const basicChargeAmount = calculateBaseCharge(aReading);

// function enrichReading
function enrichReading(orignal) {
  const result = _.cloneDeep(orignal);
+ result.baseCharge = calculateBaseCharge(result);  // 미가공 측정값에 기본 소비량을 부가 정보로 덧붙임
  return result;
}
```
- (2)변경하려는 계산 로직 중 하나를 고른다. 먼저 이 계산 로직에 측정값을 전달하기 전에 부가 정보를 덧붙이도록 수정한다.
- `calculateBaseCharge()`를 부가 정보를 덧분이는 코드 근처로 옮긴다([8.1 함수 옮기기]())
##### STEP 3
``` diff
// Client 3
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
-const basicChargeAmount = calculateBaseCharge(aReading);
+const basicChargeAmount = aReading.baseCharge;
```
- 이이서 이 함수를 사용하던 클라이언트가 부가 정보를 담은 필드(`aReading.baseCharge`)를 사용하도록 수정한다.
- `calculateBaseCharge()`를 호출하는 코드를 모두 수정했다면, 이 함수를 `enrichReading()` 안에 중첩시킬 수 있다. 그러면 "기본요금을 이용하는 클라이언트는 변환된 레코드를 사용해야 한다"는 의도를 명확히 표현할 수 있다.

##### STEP 4
``` diff
// 테스트 코드
+it('check reading unchanged', function() {
+ const baseReading = { customer: "ivan", quantity: 15, month: 5, year: 2017 };
+ const oracle = _.cloneDeep(baseReading);
+ enrichReading(baseReading);
+ assert.deepEqual(baseReading, oracle);
+})

// Client 1
-const aReading = acquireReading();
+const rawReading = acquireReading();
+const aReading = enrichReading(rawReading);
-const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
+const baseCharge = aReading.baseCharge;
```
- 여기서 주의할 점이 있다. `enrichReading()`처럼 정보를 추가해 반환할 때 원본 측정값 레코드는 변경하지 않아야 한다는 것이다. 따라서 이를 확인하는 테스트를 작성해 두는 것이 좋다.
- Client 1도 이 필드(`aReading.baseCharge`)를 사용하도록 수정한다.
##### STEP 5
``` diff
// Client 2
-const aReading = acquireReading();
+const rawReading = acquireReading();
+const aReading = enrichReading(rawReading);
const base = (baseRate(aReading.month, aReading.year) * aReading.quantity);
const taxableCharge = Math.max(0, base - taxThresold(aReading.year));
```
- 이제 Client 2의 세금을 부과할 소비량 계산으로 넘어가자. 가장 먼저 변환 함수부터 끼워 넣는다.
##### STEP 6
``` diff
// Client 2
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
-const base = (baseRate(aReading.month, aReading.year) * aReading.quantity);
+const base = aReading.baseCharge;
const taxableCharge = Math.max(0, base - taxThresold(aReading.year));
```
- 여기서 기본요금을 계산하는 부분을 앞에서 새로 만든 필드로 교체할 수 있다.
##### STEP 7
``` diff
// Client 2
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
-const base = aReading.baseCharge;
-const taxableCharge = Math.max(0, base - taxThresold(aReading.year));
+const taxableCharge = Math.max(0, aReading.baseCharge - taxThresold(aReading.year));
```
- 테스트해서 문제가 없다면 `base` 변수를 [6.4 변수 인라인하기(Inline Variable)]()한다.
##### STEP 8
``` diff
// function enrichReading
function enrichReading(orignal) {
  const result = _.cloneDeep(orignal);
  result.baseCharge = calculateBaseCharge(result);  // 미가공 측정값에 기본 소비량을 부가 정보로 덧붙임
+ result.taxableCharge = Math.max(0, result.baseCharge - taxThreshold(result.year));
  return result;
}
```
- 그런 다음 `taxableCharge`의 계산 코드를 변환함수로 옮긴다.
##### STEP 9
``` diff
// Client 2
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
-const taxableCharge = Math.max(0, aReading.baseCharge - taxThresold(aReading.year));
+const taxableCharge = aReading.taxableCharge;
```
- 이제 새로 만든 필드를 사용하도록 원본 코드를 수정한다.
- 테스트에 성공하면 `taxableCharge` 변수를 [6.4 변수 인라인하기(Inline Variable)]()한다.