import { sampleProvinceData } from './index';
import { Province } from './Province';

describe('province', function() {
  let asia;
  beforeEach(function() {
    asia = new Province(sampleProvinceData());
  });

  it('shortfall', function() {
    expect(asia.shortfall).toBe(5);
  });
  
  it('profit', function() {
    expect(asia.profit).toBe(230);
  });

  it('change production', function() {
    asia.producers[0].production = 20;
    expect(asia.shortfall).toBe(-6);
    expect(asia.profit).toBe(292);
  })

  it('zero demand', function() { // 수요가 없다.
    asia.demand = 0;
    expect(asia.shortfall).toBe(-25);
    expect(asia.profit).toBe(0);
  });

  it('negative demand', function() { // 수요가 마이너스다.
    asia.demand = -1;
    expect(asia.shortfall).toBe(-26);
    expect(asia.profit).toBe(-10);
  });

  it('empty string demand', function() { // 수요 입력란이 비어 있다.
    asia.demand = '';
    expect(asia.shortfall).toBe(NaN);
    expect(asia.profit).toBe(NaN);
  });
});

describe('no producer', function() { // 생산자가 없다.
  let noProducers;
  beforeEach(function() {
    const data = {
      name: 'No producers',
      producers: [],
      demand: 30,
      price: 20,
    };
    noProducers = new Province(data);
  });

  it('shortfall', function() {
    expect(noProducers.shortfall).toBe(30);
  });

  it('profit', function() {
    expect(noProducers.profit).toBe(0);
  });
});

describe('string for producers', function() { // 생산자 수 필드에 문자열을 대입한다.
  it('', function() {
    const data = {
      name: 'No producers',
      producers: '',
      demand: 30,
      price: 20,
    };
    const prov = new Province(data);
    expect(prov.shortfall).toBe(0);
  });
});
