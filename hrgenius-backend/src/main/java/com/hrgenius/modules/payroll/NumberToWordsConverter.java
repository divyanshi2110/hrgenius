package com.hrgenius.modules.payroll;

import java.math.BigDecimal;

public class NumberToWordsConverter {

    private static final String[] units = {
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    };

    private static final String[] tens = {
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    public static String convertToIndianCurrency(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) == 0) {
            return "Zero Rupees Only";
        }

        long whole = amount.longValue();
        int paise = amount.remainder(BigDecimal.ONE).multiply(new BigDecimal(100)).intValue();

        StringBuilder sb = new StringBuilder("Rupees ");
        sb.append(convertNumber(whole));

        if (paise > 0) {
            sb.append(" and ").append(convertNumber(paise)).append(" Paise");
        }
        sb.append(" Only");
        return sb.toString().replaceAll("\\s+", " ").trim();
    }

    private static String convertNumber(long n) {
        if (n == 0) return "";
        if (n < 0) return "Minus " + convertNumber(-n);

        StringBuilder sb = new StringBuilder();

        if (n >= 10000000) {
            sb.append(convertNumber(n / 10000000)).append(" Crore ");
            n %= 10000000;
        }
        if (n >= 100000) {
            sb.append(convertNumber(n / 100000)).append(" Lakh ");
            n %= 100000;
        }
        if (n >= 1000) {
            sb.append(convertNumber(n / 1000)).append(" Thousand ");
            n %= 1000;
        }
        if (n >= 100) {
            sb.append(convertNumber(n / 100)).append(" Hundred ");
            n %= 100;
        }
        if (n > 0) {
            if (n < 20) {
                sb.append(units[(int) n]).append(" ");
            } else {
                sb.append(tens[(int) (n / 10)]).append(" ");
                if (n % 10 > 0) {
                    sb.append(units[(int) (n % 10)]).append(" ");
                }
            }
        }
        return sb.toString();
    }
}
