import fs from 'fs'
import path from 'path'

type TestFn = () => void

interface TestCase {
  description: string
  fn: TestFn
}

class TestSuite {
  private tests: TestCase[] = []

  constructor(private suiteName: string) {}

  test(description: string, fn: TestFn) {
    this.tests.push({ description, fn })
  }

  run() {
    console.log(`\n🔎 Running test suite: ${this.suiteName}`)
    this.tests.forEach(({ description, fn }, index) => {
      try {
        fn()
        console.log(`✅ Test ${index + 1}: ${description}`)
      } catch (error) {
        console.error(`❌ Test ${index + 1}: ${description}`)
        console.error(error)
      }
    })
  }
}

export function createTestSuite(name: string) {
  return new TestSuite(name)
}

export function assertEqual<T>(actual: T, expected: T) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: expected ${expected}, got ${actual}`)
  }
}

export function assertArrayEqual<T>(actual: T[], expected: T[]) {
  if (actual.length !== expected.length || !actual.every((val, i) => val === expected[i])) {
    throw new Error(`Assertion failed: expected [${expected}], got [${actual}]`)
  }
}

export function assertNull(actual: any) {
  if (actual !== null) {
    throw new Error(`Assertion failed: expected null, got ${actual}`)
  }
}
