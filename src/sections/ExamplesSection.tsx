import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ArithExample {
  title: string;
  system: string;
  systemColor: string;
  operation: string;
  operationIcon: string;
  columnLines: { label?: string; value: string; comment?: string; isResult?: boolean; isSeparator?: boolean; isCarry?: boolean }[];
  explanation: string[];
  note: string;
  check: string;
}

const ARITH_EXAMPLES: ArithExample[] = [
  {
    title: 'Сложение в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Сложение', operationIcon: '+',
    columnLines: [
      { label: 'Перенос', value: '  1 1 1  ', isCarry: true },
      { value: '  1 0 1 1', comment: '= 11₁₀' },
      { label: '+', value: '  1 1 0 1', comment: '= 13₁₀' },
      { isSeparator: true, value: '' },
      { value: '1 1 0 0 0', comment: '= 24₁₀', isResult: true },
    ],
    explanation: [
      'Бит 0 (правый): 1+1 = 10₂ → пишем 0, перенос 1',
      'Бит 1: 1+0+1(перенос) = 10₂ → пишем 0, перенос 1',
      'Бит 2: 0+1+1(перенос) = 10₂ → пишем 0, перенос 1',
      'Бит 3: 1+1+1(перенос) = 11₂ → пишем 1, перенос 1',
      'Бит 4: 0+0+1(перенос) = 1 → пишем 1',
      'Результат: 11000₂ = 24₁₀ ✓',
    ],
    note: 'Таблица сложения: 0+0=0, 0+1=1, 1+1=10, 1+1+1=11. Перенос передаётся в следующий разряд.',
    check: '11₁₀ + 13₁₀ = 24₁₀ ✓',
  },
  {
    title: 'Вычитание в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Вычитание', operationIcon: '−',
    columnLines: [
      { value: '1 0 1 1 0', comment: '= 22₁₀' },
      { label: '−', value: '  0 1 1 1', comment: '= 7₁₀' },
      { isSeparator: true, value: '' },
      { value: '  1 1 1 1', comment: '= 15₁₀', isResult: true },
    ],
    explanation: [
      'Бит 0: 0−1 нельзя → занимаем из бит 1. Бит 1 = 0, идём дальше.',
      'Занимаем из бит 2 (=1). Бит 2 становится 0, бит 1 = 10₂.',
      'Бит 1 отдаёт бит 0: бит 0 = 10₂ − 1 = 1, бит 1 = 1−1 = 0... считаем поразрядно.',
      'Бит 0: 10₂−1 = 1 (с заёмом)', 'Бит 1: 0₂−1 = 1 (с заёмом)', 'Бит 2: 0₂−1 = 1 (с заёмом)',
      'Бит 3: 1₂−0 = 1', 'Результат: 1111₂ = 15₁₀ ✓',
    ],
    note: 'При нехватке берём заём из старшего разряда: занятый разряд даёт +2 к текущему.',
    check: '22₁₀ − 7₁₀ = 15₁₀ ✓',
  },
  {
    title: 'Умножение в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Умножение', operationIcon: '×',
    columnLines: [
      { value: '    1 0 1 1', comment: '= 11₁₀' },
      { label: '×', value: '      1 0 1', comment: '= 5₁₀' },
      { isSeparator: true, value: '' },
      { label: '×1:', value: '    1 0 1 1', comment: 'сдвиг 0' },
      { label: '×0:', value: '  0 0 0 0 ·', comment: 'сдвиг 1, =0' },
      { label: '×1:', value: '1 0 1 1 · ·', comment: 'сдвиг 2' },
      { isSeparator: true, value: '' },
      { value: '1 1 0 1 1 1', comment: '= 55₁₀', isResult: true },
    ],
    explanation: [
      'Умножаем 1011 на каждую цифру множителя (с права налево):',
      '1011 × 1 = 1011 (сдвиг 0 влево)',
      '1011 × 0 = 0000 (сдвиг 1 влево)',
      '1011 × 1 = 1011 (сдвиг 2 влево)',
      'Складываем три частичных произведения:',
      '001011 + 000000 + 101100 = 110111₂',
    ],
    note: 'Умножение в двоичной — это сдвиги и сложения. Именно так работает процессор!',
    check: '11₁₀ × 5₁₀ = 55₁₀ ✓',
  },
  {
    title: 'Деление в двоичной системе',
    system: 'Двоичная (2)', systemColor: 'var(--neon-blue)',
    operation: 'Деление', operationIcon: '÷',
    columnLines: [
      { value: '1 1 0 1 ÷ 1 1 = ?', comment: '13÷3=?' },
      { isSeparator: true, value: '' },
      { label: 'Шаг 1:', value: '11 ÷ 11 = 1', comment: 'первые 2 бита' },
      { label: '', value: '11 − 11 = 00', comment: 'остаток 0' },
      { label: 'Шаг 2:', value: '001 ÷ 11 = 0', comment: 'недостаточно' },
      { label: 'Шаг 3:', value: '0011 → нет', comment: 'сносим следующий' },
      { label: 'Итог:', value: '100 остаток 1', comment: '=4 ост. 1', isResult: true },
    ],
    explanation: [
      'Делитель: 11₂ = 3, делимое: 1101₂ = 13',
      'Берём 2 старших бита: 11₂. 11÷11 = 1, остаток 0.',
      'Сносим следующий бит: получаем 00. 0÷11 = 0.',
      'Сносим следующий бит: получаем 001. 1÷11 = 0.',
      'Берём 01 + следующий = 011. 11÷11 = 1, остаток 0.',
      'Частное: 100₂ = 4. Остаток: 1₂ = 1.',
      'Проверка: 4 × 3 + 1 = 13 ✓',
    ],
    note: 'Деление в столбик в двоичной работает так же, как в десятичной — но деление только на 0 или 1.',
    check: '13₁₀ ÷ 3₁₀ = 4 ост. 1 ✓',
  },
  {
    title: 'Сложение в восьмеричной системе',
    system: 'Восьмеричная (8)', systemColor: 'var(--neon-purple)',
    operation: 'Сложение', operationIcon: '+',
    columnLines: [
      { label: 'Перенос', value: '  1    ', isCarry: true },
      { value: '  3 7 5', comment: '= 253₁₀' },
      { label: '+', value: '  2 4 6', comment: '= 166₁₀' },
      { isSeparator: true, value: '' },
      { value: '  6 4 3', comment: '= 419₁₀', isResult: true },
    ],
    explanation: [
      'Разряд 0: 5+6 = 11₁₀ = 13₈ → пишем 3, перенос 1',
      'Разряд 1: 7+4+1(перенос) = 12₁₀ = 14₈ → пишем 4, перенос 1',
      'Разряд 2: 3+2+1(перенос) = 6₁₀ = 6₈ → пишем 6',
      'Результат: 643₈ = 419₁₀ ✓',
    ],
    note: 'Если сумма цифр ≥ 8 — вычитаем 8 и передаём перенос 1. Цифры 0–7, девятки нет!',
    check: '253₁₀ + 166₁₀ = 419₁₀ ✓',
  },
  {
    title: 'Сложение в шестнадцатеричной системе',
    system: 'Шестнадцатеричная (16)', systemColor: 'var(--neon-green)',
    operation: 'Сложение', operationIcon: '+',
    columnLines: [
      { label: 'Перенос', value: '    1  ', isCarry: true },
      { value: '  A B 8', comment: '= 2744₁₀' },
      { label: '+', value: '  3 F 9', comment: '= 1017₁₀' },
      { isSeparator: true, value: '' },
      { value: '  E F 1', comment: '= 3761₁₀', isResult: true },
    ],
    explanation: [
      'Разряд 0: 8+9 = 17₁₀ = 11₁₆ → пишем 1, перенос 1',
      'Разряд 1: B+F+1 = 11+15+1 = 27₁₀ = 1B₁₆ → пишем B, перенос 1',
      'Разряд 2: A+3+1 = 10+3+1 = 14₁₀ = E₁₆ → пишем E',
      'Результат: EF1₁₆ = 3761₁₀ ✓',
    ],
    note: 'A=10, B=11, C=12, D=13, E=14, F=15. Если сумма ≥ 16 — делим нацело на 16, пишем остаток, переносим частное.',
    check: '2744₁₀ + 1017₁₀ = 3761₁₀ ✓',
  },
  {
    title: 'Вычитание в шестнадцатеричной системе',
    system: 'Шестнадцатеричная (16)', systemColor: 'var(--neon-green)',
    operation: 'Вычитание', operationIcon: '−',
    columnLines: [
      { value: '  F 3 C', comment: '= 3900₁₀' },
      { label: '−', value: '  A 7 E', comment: '= 2686₁₀' },
      { isSeparator: true, value: '' },
      { value: '  4 B E', comment: '= 1214₁₀', isResult: true },
    ],
    explanation: [
      'Разряд 0: C−E = 12−14 < 0 → занимаем 16. 12+16−14 = 14₁₀ = E₁₆',
      'Разряд 1: 3−7−1(заём) = 3−8 < 0 → занимаем 16. 3+16−7−1 = 11₁₀ = B₁₆',
      'Разряд 2: F−A−1(заём) = 15−10−1 = 4₁₀ = 4₁₆',
      'Результат: 4BE₁₆ = 1214₁₀ ✓',
    ],
    note: 'Заём в 16-ричной равен 16 (не 10). Не забывай вычитать единицу за заём из следующего разряда.',
    check: '3900₁₀ − 2686₁₀ = 1214₁₀ ✓',
  },
  {
    title: 'Умножение в восьмеричной системе',
    system: 'Восьмеричная (8)', systemColor: 'var(--neon-purple)',
    operation: 'Умножение', operationIcon: '×',
    columnLines: [
      { value: '    2 5', comment: '= 21₁₀' },
      { label: '×', value: '      7', comment: '= 7₁₀' },
      { isSeparator: true, value: '' },
      { label: 'Ш.1:', value: '5×7 = 35₁₀ = 43₈', comment: '→ 3, пер. 4' },
      { label: 'Ш.2:', value: '2×7+4 = 18₁₀ = 22₈', comment: '→ 22' },
      { isSeparator: true, value: '' },
      { value: '  2 2 3', comment: '= 147₁₀', isResult: true },
    ],
    explanation: [
      '5 × 7 = 35₁₀. Переводим в восьмеричную: 35÷8=4 ост.3 → пишем 3, перенос 4',
      '2 × 7 = 14₁₀, плюс перенос 4 = 18₁₀. 18÷8=2 ост.2 → пишем 2, перенос 2',
      'Перенос 2 записываем как есть.',
      'Результат: 223₈ = 147₁₀ ✓',
    ],
    note: 'Умножаем как обычно в десятичной, но промежуточные результаты переводим в восьмеричную для записи.',
    check: '21₁₀ × 7₁₀ = 147₁₀ ✓',
  },
  {
    title: 'Вычитание в восьмеричной системе',
    system: 'Восьмеричная (8)', systemColor: 'var(--neon-purple)',
    operation: 'Вычитание', operationIcon: '−',
    columnLines: [
      { value: '  7 4 2', comment: '= 482₁₀' },
      { label: '−', value: '  2 5 6', comment: '= 174₁₀' },
      { isSeparator: true, value: '' },
      { value: '  4 6 4', comment: '= 308₁₀', isResult: true },
    ],
    explanation: [
      'Разряд 0: 2−6 < 0 → занимаем 8. 2+8−6 = 4₈',
      'Разряд 1: 4−5−1(заём) = 4−6 < 0 → занимаем 8. 4+8−5−1 = 6₈',
      'Разряд 2: 7−2−1(заём) = 4₈',
      'Результат: 464₈ = 308₁₀ ✓',
    ],
    note: 'Заём в восьмеричной равен 8 (не 10). После займа не забудь вычесть 1 из следующего разряда.',
    check: '482₁₀ − 174₁₀ = 308₁₀ ✓',
  },
  {
    title: 'Деление в восьмеричной системе',
    system: 'Восьмеричная (8)', systemColor: 'var(--neon-purple)',
    operation: 'Деление', operationIcon: '÷',
    columnLines: [
      { value: '1 7 4 ÷ 4 = ?', comment: '124÷4=?' },
      { isSeparator: true, value: '' },
      { label: 'Шаг 1:', value: '17₈ ÷ 4₈ = 3₈', comment: '15÷4=3 ост.3' },
      { label: '', value: '17₈ − 14₈ = 3₈', comment: 'остаток 3' },
      { label: 'Шаг 2:', value: '34₈ ÷ 4₈ = 7₈', comment: '28÷4=7 ост.0' },
      { label: '', value: '34₈ − 34₈ = 0', comment: 'остаток 0' },
      { label: 'Итог:', value: '3 7', comment: '= 31₁₀', isResult: true },
    ],
    explanation: [
      'Переводим для проверки: 174₈ = 1×64+7×8+4 = 124₁₀, делитель 4₈ = 4₁₀',
      'Берём первые цифры: 17₈ = 15₁₀. 15÷4 = 3 ост. 3.',
      '3₁₀ = 3₈ → пишем 3 в частное.',
      'Остаток 3₁₀ = 3₈, сносим следующую цифру 4: получаем 34₈ = 28₁₀.',
      '28÷4 = 7 ост. 0 → пишем 7 в частное.',
      'Частное: 37₈ = 31₁₀. Остаток: 0. Проверка: 31×4 = 124 ✓',
    ],
    note: 'Делим как в десятичной, но все промежуточные числа нужно воспринимать как восьмеричные.',
    check: '124₁₀ ÷ 4₁₀ = 31₁₀ ✓',
  },
  {
    title: 'Умножение в шестнадцатеричной системе',
    system: 'Шестнадцатеричная (16)', systemColor: 'var(--neon-green)',
    operation: 'Умножение', operationIcon: '×',
    columnLines: [
      { value: '    B 4', comment: '= 180₁₀' },
      { label: '×', value: '      9', comment: '= 9₁₀' },
      { isSeparator: true, value: '' },
      { label: 'Ш.1:', value: '4×9 = 36₁₀ = 24₁₆', comment: '→ 4, пер. 2' },
      { label: 'Ш.2:', value: 'B×9+2 = 101₁₀ = 65₁₆', comment: '→ 5, пер. 6' },
      { isSeparator: true, value: '' },
      { value: '  6 5 4', comment: '= 1620₁₀', isResult: true },
    ],
    explanation: [
      '4 × 9 = 36₁₀. 36÷16=2 ост.4 → пишем 4, перенос 2.',
      'B₁₆ = 11₁₀. 11 × 9 = 99₁₀, плюс перенос 2 = 101₁₀.',
      '101÷16 = 6 ост. 5 → пишем 5, перенос 6.',
      'Перенос 6 записываем как есть.',
      'Результат: 654₁₆ = 1620₁₀ ✓',
    ],
    note: 'B₁₆=11, умножаем в десятичной, остаток и перенос записываем снова в 16-ричной.',
    check: '180₁₀ × 9₁₀ = 1620₁₀ ✓',
  },
  {
    title: 'Деление в шестнадцатеричной системе',
    system: 'Шестнадцатеричная (16)', systemColor: 'var(--neon-green)',
    operation: 'Деление', operationIcon: '÷',
    columnLines: [
      { value: 'A B 0 ÷ C = ?', comment: '2736÷12=?' },
      { isSeparator: true, value: '' },
      { label: 'Шаг 1:', value: 'AB₁₆ ÷ C₁₆ = E₁₆', comment: '171÷12=14 ост.3' },
      { label: '', value: 'AB₁₆ − A8₁₆ = 3', comment: 'остаток 3₁₀' },
      { label: 'Шаг 2:', value: '30₁₆ ÷ C₁₆ = 4', comment: '48÷12=4 ост.0' },
      { label: '', value: '30₁₆ − 30₁₆ = 0', comment: 'остаток 0' },
      { label: 'Итог:', value: 'E 4', comment: '= 228₁₀', isResult: true },
    ],
    explanation: [
      'AB₁₆ = 10×16+11 = 171₁₀, C₁₆ = 12₁₀.',
      '171÷12 = 14 ост. 3. 14₁₀ = E₁₆ → пишем E в частное.',
      'Остаток 3₁₀, сносим следующую цифру 0₁₆: получаем 30₁₆ = 48₁₀.',
      '48÷12 = 4 ост. 0 → пишем 4 в частное.',
      'Частное: E4₁₆ = 228₁₀. Проверка: 228×12 = 2736 ✓',
    ],
    note: 'Перевод промежуточных остатков в десятичную и обратно — ключ к делению в 16-ричной системе.',
    check: '2736₁₀ ÷ 12₁₀ = 228₁₀ ✓',
  },
  {
    title: 'Сложение в десятичной системе',
    system: 'Десятичная (10)', systemColor: '#ff9f00',
    operation: 'Сложение', operationIcon: '+',
    columnLines: [
      { label: 'Перенос', value: '  1 1 1', isCarry: true },
      { value: '  4 7 8', comment: '' },
      { label: '+', value: '  3 6 5', comment: '' },
      { isSeparator: true, value: '' },
      { value: '  8 4 3', comment: '', isResult: true },
    ],
    explanation: [
      'Разряд 0: 8+5 = 13 → пишем 3, перенос 1',
      'Разряд 1: 7+6+1(перенос) = 14 → пишем 4, перенос 1',
      'Разряд 2: 4+3+1(перенос) = 8 → пишем 8',
      'Результат: 843 ✓',
    ],
    note: 'Классическое сложение в столбик: если сумма ≥ 10 — пишем единицы, перенос 1 в следующий разряд.',
    check: '478 + 365 = 843 ✓',
  },
  {
    title: 'Вычитание в десятичной системе',
    system: 'Десятичная (10)', systemColor: '#ff9f00',
    operation: 'Вычитание', operationIcon: '−',
    columnLines: [
      { value: '  7 0 3', comment: '' },
      { label: '−', value: '  2 4 8', comment: '' },
      { isSeparator: true, value: '' },
      { value: '  4 5 5', comment: '', isResult: true },
    ],
    explanation: [
      'Разряд 0: 3−8 < 0 → занимаем 10. 3+10−8 = 5',
      'Разряд 1: 0−4−1(заём) = −5 < 0 → занимаем 10. 0+10−4−1 = 5',
      'Разряд 2: 7−2−1(заём) = 4',
      'Результат: 455 ✓',
    ],
    note: 'При нехватке занимаем 10 из следующего разряда. Следующий разряд уменьшается на 1.',
    check: '703 − 248 = 455 ✓',
  },
  {
    title: 'Умножение в десятичной системе',
    system: 'Десятичная (10)', systemColor: '#ff9f00',
    operation: 'Умножение', operationIcon: '×',
    columnLines: [
      { value: '    3 4 7', comment: '' },
      { label: '×', value: '      2 6', comment: '' },
      { isSeparator: true, value: '' },
      { label: '×6:', value: '  2 0 8 2', comment: 'сдвиг 0' },
      { label: '×2:', value: '6 9 4 0 ·', comment: 'сдвиг 1' },
      { isSeparator: true, value: '' },
      { value: '9 0 2 2', comment: '', isResult: true },
    ],
    explanation: [
      '347 × 6 = 2082 (первое частичное произведение, сдвиг 0)',
      '347 × 2 = 694, записываем со сдвигом 1 → 6940',
      'Складываем: 2082 + 6940 = 9022',
      'Результат: 9022 ✓',
    ],
    note: 'Умножение в столбик: умножаем на каждую цифру множителя, сдвигаем влево, затем складываем.',
    check: '347 × 26 = 9022 ✓',
  },
  {
    title: 'Деление в десятичной системе',
    system: 'Десятичная (10)', systemColor: '#ff9f00',
    operation: 'Деление', operationIcon: '÷',
    columnLines: [
      { value: '8 7 5 ÷ 2 5 = ?', comment: '' },
      { isSeparator: true, value: '' },
      { label: 'Шаг 1:', value: '87 ÷ 25 = 3', comment: 'берём 2 цифры' },
      { label: '', value: '87 − 75 = 12', comment: 'остаток 12' },
      { label: 'Шаг 2:', value: '125 ÷ 25 = 5', comment: 'сносим 5' },
      { label: '', value: '125 − 125 = 0', comment: 'остаток 0' },
      { label: 'Итог:', value: '3 5', comment: '', isResult: true },
    ],
    explanation: [
      'Берём первые 2 цифры: 87. 87÷25 = 3 (т.к. 3×25=75 ≤ 87 < 4×25=100).',
      'Остаток: 87−75 = 12. Сносим следующую цифру 5 → 125.',
      '125÷25 = 5 (т.к. 5×25=125). Остаток: 0.',
      'Частное: 35. Проверка: 35×25 = 875 ✓',
    ],
    note: 'Деление в столбик: подбираем цифру частного так, чтобы произведение не превышало текущий остаток.',
    check: '875 ÷ 25 = 35 ✓',
  },
];

function ColumnBlock({ lines, systemColor }: { lines: ArithExample['columnLines'], systemColor: string }) {
  return (
    <div className="rounded-xl p-5 font-mono text-base leading-7" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${systemColor}25` }}>
      {lines.map((line, i) => (
        <div key={i}>
          {line.isSeparator ? (
            <div className="border-t my-1" style={{ borderColor: `${systemColor}40` }} />
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="w-16 text-right flex-shrink-0 text-xs" style={{ color: line.isCarry ? '#ff9f00' : `${systemColor}80` }}>
                {line.label ?? ''}
              </span>
              <span
                className="tracking-widest font-bold text-lg"
                style={{ color: line.isResult ? systemColor : line.isCarry ? '#ff9f00' : 'var(--foreground)' }}
              >
                {line.value}
              </span>
              {line.comment && (
                <span className="text-xs ml-1" style={{ color: `${systemColor}70` }}>{line.comment}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const CONVERT_EXAMPLES = [
  {
    title: 'Перевод 42 из десятичной в двоичную', from: '42₁₀', to: '101010₂',
    steps: [
      { action: '42 ÷ 2', result: '= 21, остаток 0' }, { action: '21 ÷ 2', result: '= 10, остаток 1' },
      { action: '10 ÷ 2', result: '= 5, остаток 0' }, { action: '5 ÷ 2', result: '= 2, остаток 1' },
      { action: '2 ÷ 2', result: '= 1, остаток 0' }, { action: '1 ÷ 2', result: '= 0, остаток 1' },
      { action: 'Читаем остатки снизу вверх', result: '101010' },
    ],
    note: 'Метод деления на основание — универсальный для перевода в любую систему'
  },
  {
    title: 'Перевод 1A3 из 16-ричной в десятичную', from: '1A3₁₆', to: '419₁₀',
    steps: [
      { action: '1 × 16² = 1 × 256', result: '= 256' }, { action: 'A × 16¹ = 10 × 16', result: '= 160' },
      { action: '3 × 16⁰ = 3 × 1', result: '= 3' }, { action: '256 + 160 + 3', result: '= 419' },
    ],
    note: 'A в 16-ричной = 10 в десятичной. Применяем позиционный принцип.'
  },
  {
    title: 'Перевод 255 из десятичной в шестнадцатеричную', from: '255₁₀', to: 'FF₁₆',
    steps: [
      { action: '255 ÷ 16', result: '= 15, остаток 15 (F)' }, { action: '15 ÷ 16', result: '= 0, остаток 15 (F)' },
      { action: 'Читаем остатки снизу вверх', result: 'FF' },
    ],
    note: 'Остатки 10–15 записываем буквами A–F'
  },
  {
    title: 'Перевод 111111₂ в восьмеричную', from: '111111₂', to: '77₈',
    steps: [
      { action: 'Группируем по 3 бита справа', result: '111 111' }, { action: '111₂ = 4+2+1', result: '= 7' },
      { action: '111₂ = 4+2+1', result: '= 7' }, { action: 'Объединяем', result: '77₈' },
    ],
    note: 'Быстрый способ: 3 двоичных бита = 1 восьмеричная цифра!'
  },
  {
    title: 'Перевод 3C из 16-ричной в двоичную', from: '3C₁₆', to: '00111100₂',
    steps: [
      { action: '3₁₆ → 4 бита', result: '0011' }, { action: 'C₁₆ = 12 → 4 бита', result: '1100' },
      { action: 'Объединяем', result: '00111100' },
    ],
    note: 'Каждая шестнадцатеричная цифра = ровно 4 двоичных бита'
  },
];

const OPERATION_COLOR: Record<string, string> = {
  'Сложение': 'var(--neon-green)',
  'Вычитание': 'rgba(255,60,60,0.85)',
  'Умножение': '#ff9f00',
  'Деление': 'var(--neon-purple)',
};

export default function ExamplesSection() {
  const [tab, setTab] = useState<'convert' | 'arith'>('convert');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [openArith, setOpenArith] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="font-oswald text-4xl font-bold mb-2"><span style={{ color: '#ff9f00' }}>ПРИМЕРЫ</span></h2>
      <p className="text-muted-foreground mb-6">Нажми на задачу, чтобы увидеть подробное решение</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 rounded-xl glass w-fit">
        {([['convert', 'Перевод чисел', 'ArrowLeftRight'], ['arith', 'Арифметика в столбик', 'Calculator']] as const).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => { setTab(id); setOpenIdx(null); setOpenArith(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={tab === id ? { background: '#ff9f00', color: '#050d14', fontWeight: 700 } : { color: 'var(--muted-foreground)' }}
          >
            <Icon name={icon} size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Convert tab */}
      {tab === 'convert' && (
        <div className="space-y-4">
          {CONVERT_EXAMPLES.map((ex, i) => (
            <div key={i} className="neon-border rounded-2xl overflow-hidden transition-all duration-300">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full p-5 text-left flex items-center gap-4 hover:bg-white/[0.02]">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-oswald font-bold text-sm" style={{ background: 'rgba(255,159,0,0.15)', color: '#ff9f00' }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-golos font-semibold text-foreground mb-0.5">{ex.title}</div>
                  <div className="text-sm text-muted-foreground">
                    <span style={{ color: 'var(--neon-blue)' }}>{ex.from}</span>
                    <span className="mx-2">→</span>
                    <span style={{ color: 'var(--neon-green)' }}>{ex.to}</span>
                  </div>
                </div>
                <Icon name={openIdx === i ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-muted-foreground flex-shrink-0" />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 animate-fade-in-up">
                  <div className="space-y-2 mb-4">
                    {ex.steps.map((step, j) => (
                      <div key={j} className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold" style={{ background: 'rgba(255,159,0,0.2)', color: '#ff9f00' }}>{j + 1}</div>
                        <div className="code-block flex-1 flex justify-between text-sm flex-wrap gap-2">
                          <span className="text-foreground">{step.action}</span>
                          <span style={{ color: 'var(--neon-green)' }} className="font-bold">{step.result}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {ex.note && (
                    <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,159,0,0.08)', border: '1px solid rgba(255,159,0,0.2)' }}>
                      <Icon name="Lightbulb" size={16} style={{ color: '#ff9f00', flexShrink: 0 }} />
                      <span className="text-sm text-muted-foreground">{ex.note}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Arith tab */}
      {tab === 'arith' && (
        <div className="space-y-4">
          {ARITH_EXAMPLES.map((ex, i) => {
            const opColor = OPERATION_COLOR[ex.operation];
            const isOpen = openArith === i;
            return (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300" style={{ border: `1px solid ${ex.systemColor}25` }}>
                <button
                  onClick={() => setOpenArith(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center gap-4 hover:bg-white/[0.02]"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-oswald font-bold text-lg"
                    style={{ background: `${opColor}20`, color: opColor }}>
                    {ex.operationIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-golos font-semibold text-foreground mb-1">{ex.title}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${ex.systemColor}15`, color: ex.systemColor }}>
                        {ex.system}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${opColor}15`, color: opColor }}>
                        {ex.operation}
                      </span>
                    </div>
                  </div>
                  <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-muted-foreground flex-shrink-0" />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 animate-fade-in-up space-y-5">
                    <div>
                      <div className="text-xs font-oswald tracking-widest text-muted-foreground mb-2">ПРИМЕР В СТОЛБИК</div>
                      <ColumnBlock lines={ex.columnLines} systemColor={ex.systemColor} />
                    </div>

                    <div>
                      <div className="text-xs font-oswald tracking-widest text-muted-foreground mb-2">РАЗБОР ПО ШАГАМ</div>
                      <div className="space-y-2">
                        {ex.explanation.map((step, j) => (
                          <div key={j} className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold"
                              style={{ background: `${opColor}20`, color: opColor }}>{j + 1}</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: `${ex.systemColor}08`, border: `1px solid ${ex.systemColor}20` }}>
                      <Icon name="Lightbulb" size={16} style={{ color: ex.systemColor, flexShrink: 0 }} />
                      <span className="text-sm text-muted-foreground">{ex.note}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-oswald font-semibold" style={{ color: 'var(--neon-green)' }}>
                      <Icon name="Check" size={16} />
                      Проверка: {ex.check}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}