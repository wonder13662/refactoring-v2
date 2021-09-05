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