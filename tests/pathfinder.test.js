import { portalConnectionsList } from '@/entity/levels/water-arena/config.js'
import { createTestSuite, assertArrayEqual, assertNull } from './testEngine.js'
import { findShortestPath } from '@/engine/pathfinder.js'

const suite = createTestSuite('Pathfinder Algorithm')

// Sample data
const islandConnections = portalConnectionsList

// Test cases
suite.test('Same island should return an empty path', () => {
  assertArrayEqual(findShortestPath(1, 1, islandConnections), [])
})

suite.test('Direct connection should return the correct path', () => {
  assertArrayEqual(findShortestPath(1, 5, islandConnections), [1, 5])
})

suite.test('Multi-step connection should return the shortest path', () => {
  assertArrayEqual(findShortestPath(0, 6, islandConnections), [0, 1, 4, 6])
})

suite.test('No connection should return null', () => {
  assertNull(findShortestPath(2, 6, islandConnections))
})

// Run the tests
suite.run()
