/**
 * 计算多项式的值（系数按降幂排序）
 * @param {number} maxDegree 多项式的最高次数
 * @param {number[]} coefficients 多项式系数数组，从高次到低次排列
 * @param {number} x 变量的值
 * @returns {number} 多项式在x处的计算结果
 */
export function calculatePolynomial(maxDegree, coefficients, x) {
    if (maxDegree < 0) {
        throw new Error("最高次数必须为非负整数");
    }
    if (coefficients.length !== maxDegree + 1) {
        throw new Error("系数数组长度应与最高次数+1相等");
    }

    let result = 0;

    // 使用霍纳法则(Horner's method)，系数按降幂排序
    for (let i = 0; i <= maxDegree; i++) {
        result = result * x + coefficients[i];
    }

    return result;
}

/**
 * 等级成长数值计算
 * 1级取值min，15级取值max
 */
export function growByLevel(level, min, max) {
    return min + (max - min) * (level - 1) / 14;
}
