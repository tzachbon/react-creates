const maze = [
  [0 /* s */, 1, 0],
  [0, 1, 0 /** e */],
  [0, 0, 0],
];

const start = { i: 0, j: 0 };
const end = { i: 1, j: 2 };

function solve(maze, start, end, visited = {}) {
  for (let i = start.i; i < maze.length; i++) {
    const row = maze[i];

    for (let j = start.j; j < row.length; j++) {
      const cell = row[j];

      if (cell.i === end.i && cell.j === end.j) {
        return true;
      }

      const ns = getN(maze, cell);

      if (!ns.length) return false;

      visited[`${cell.i}-${cell.j}`] = true;

      for (const n of ns) {
        if (!visited[`${n.i}-${n.j}`]) {
          solve(maze, n, end, visited);
        }
      }

      return false;
    }
  }
}

function getN(maze, c) {
  const ns = [];

  if (c.i > 0 && maze[c.i - 1][c.j] === 0) {
    ns.push({ i: c.i - 1, j: c.j });
  }

  if (c.j > 0 && maze[c.i][c.j - 1] === 0) {
    ns.push({ i: c.i, j: c.j - 1 });
  }

  if (c.i < maze.length - 1 && maze[c.i + 1][c.j] === 0) {
    ns.push({ i: c.i + 1, j: c.j });
  }

  if (c.j < maze[0].length - 1 && maze[c.i][c.j + 1] === 0) {
    ns.push({ i: c.i, j: c.j + 1 });
  }

  return ns;
}
