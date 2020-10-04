const getRandomInt = require('./sum');

test('小さい数字！',() =>{
    expect(getRandomInt(10)).toBeLessThan(10)
}
);