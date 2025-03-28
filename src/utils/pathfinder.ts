import type { PortalConnection } from '@/types/world'

export const findShortestPath = (
  graph: Map<number, number[]>,
  startGroup: number,
  targetGroup: number
): number[] | null => {
  if (startGroup === targetGroup) return [] // ✅ Already at target

  const queue: [number, number[]][] = [[startGroup, [startGroup]]]
  const visited = new Set<number>([startGroup])

  while (queue.length > 0) {
    const [current, path] = queue.shift()!

    for (const neighbor of graph.get(current) || []) {
      if (neighbor === targetGroup) return [...path, neighbor] // ✅ Found shortest path
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([neighbor, [...path, neighbor]])
      }
    }
  }

  return null // ❌ No valid path found
}

const buildGroupGraph = (connections: PortalConnection[]): Map<number, number[]> => {
  const graph = new Map<number, number[]>()

  connections.forEach(({ entryGroup, exitGroup }) => {
    if (!graph.has(entryGroup)) graph.set(entryGroup, [])
    graph.get(entryGroup)!.push(exitGroup) // One-way connection
  })

  return graph
}

// Modified function to return a plain object instead of a Map
export const generateTransitionMap = (
  connections: PortalConnection[]
): Record<number, Record<number, number[] | null>> => {
  const graph = buildGroupGraph(connections)
  const transitionMap: Record<number, Record<number, number[] | null>> = {}

  const allGroups = new Set<number>()
  connections.forEach(({ entryGroup, exitGroup }) => {
    allGroups.add(entryGroup)
    allGroups.add(exitGroup)
  })

  for (const startGroup of allGroups) {
    const paths: Record<number, number[] | null> = {}
    for (const targetGroup of allGroups) {
      paths[targetGroup] = findShortestPath(graph, startGroup, targetGroup)
    }
    transitionMap[startGroup] = paths
  }

  return transitionMap
}
