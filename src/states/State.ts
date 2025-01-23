export default class State {
  parent: any

  constructor(parent: any) {
    this.parent = parent
  }

  enter(previousState: any) {}
  exit() {}
  update(_: any, input: any) {}
}
