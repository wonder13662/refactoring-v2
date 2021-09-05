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


