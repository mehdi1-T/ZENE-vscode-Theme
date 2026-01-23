class Calculator:
    def __init__(self):
        self.result = 0

    def add(self, a, b):
        self.result = a + b
        return self.result

    def subtract(self, a, b):
        self.result = a - b
        return self.result

    def multiply(self, a, b):
        self.result = a * b
        return self.result

    def divide(self, a, b):
        if b == 0:
            return "Error! Division by zero."
        self.result = a / b
        return self.result

# Example usage:
calc = Calculator()

print("Add: 5 + 3 =", calc.add(5, 3))
print("Subtract: 10 - 4 =", calc.subtract(10, 4))
print("Multiply: 6 * 7 =", calc.multiply(6, 7))
print("Divide: 8 / 2 =", calc.divide(8, 2))
print("Divide: 5 / 0 =", calc.divide(5, 0))
