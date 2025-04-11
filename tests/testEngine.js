import { createTestSuite, assertEqual } from './testEngine.js'
import { removeDoubleSlashComments } from '@/utils/function.ts'

const suite = createTestSuite('removeDoubleSlashComments Function')

suite.test('Should remove single line comment at the end of a line', () => {
  const input = 'const x = 10; // This is a comment'
  const expected = 'const x = 10; '
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove a line with only a comment', () => {
  const input = '// This is a comment line'
  const expected = ''
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove a comment with leading spaces', () => {
  const input = '  // This comment has leading spaces'
  const expected = ''
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove a comment with trailing spaces', () => {
  const input = '// This comment has trailing spaces  '
  const expected = ''
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove a comment with leading and trailing spaces', () => {
  const input = '   //  This comment has both spaces  '
  const expected = ''
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should handle code with multiple lines and comments', () => {
  const input = `
    function test() {
      const a = 5; // First comment
      let b = 10;   // Second comment with more spaces
      return a + b;
    }
    // This is a function comment
  `
  const expected = `
    function test() {
      const a = 5; 
      let b = 10;   
      return a + b;
    }
    
  `
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should not remove lines without comments', () => {
  const input = `
    function noComments() {
      const value = 42;
      return value;
    }
  `
  assertEqual(removeDoubleSlashComments(input), input)
})

suite.test('Should handle empty string', () => {
  const input = ''
  const expected = ''
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove comment with ">" and spaces', () => {
  const input = 'const value = 123;  // > Info here'
  const expected = 'const value = 123;  '
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove a line with only "// >"', () => {
  const input = '// >'
  const expected = ''
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove "//>" without spaces', () => {
  const input = 'let flag = true; //>Flag status'
  const expected = 'let flag = true; '
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should remove "// > " with spaces', () => {
  const input = '// > '
  const expected = ''
  assertEqual(removeDoubleSlashComments(input), expected)
})

suite.test('Should handle mixed comments and non-comments', () => {
  const input = `
    // This is a top comment
    const name = "Alice";
    // Another comment below
    const age = 30; // Age of Alice
    if (age > 25) {
      console.log("Adult"); // Check if adult
    }
  `
  const expected = `
    
    const name = "Alice";
    
    const age = 30; 
    if (age > 25) {
      console.log("Adult"); 
    }
  `
  assertEqual(removeDoubleSlashComments(input), expected)
})

// Run the tests
suite.run()
