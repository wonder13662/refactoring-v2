import { sampleProvinceData } from './index';
import { Province } from './Province';

describe('province', function() {
  it('shortfall', function() {
    const asia = new Province(sampleProvinceData()); // 1. 픽스처 설정
    expect(asia.shortfall).toBe(5); // 2. 검증
  })
});
