function h(element, props = {}, ..._children) {
  return { element, props, _children };
}

function render(vnodes, dom) {
  const nodes = [].concat(vnodes);

  nodes.forEach((vnode, index) => {
    const oldNode = dom.childNodes[index];
    const state = oldNode && oldNode.element == vnode.element && oldNode.state || {};
    const data = { element: vnode.element, state, ...vnode.props };

    // Run components
    while ((vnode.element || vnodes).bind) {
      const setState = (newState) => Object.assign(state, newState) && render(vnodes, dom);
      vnode = vnode.element(vnode.props, state, setState);
    }

    // Create a new element
    let newNode = vnode.element
      ? document.createElement(vnode.element)
      : document.createTextNode(vnode);

    // Reconcile
    if (oldNode && oldNode.element != vnode.element && oldNode.vnode != vnode) {
      dom.replaceChild(newNode, oldNode);
    } else if (oldNode) {
      newNode = oldNode;
    } else {
      newNode = dom.appendChild(newNode);
    }

    // Copy properties
    Object.assign(newNode, data, { vnode });

    // Render children
    render(vnode._children || [], newNode);
  });

  // Remove unused children
  while (dom.childNodes[nodes.length]) {
    dom.removeChild(dom.childNodes[nodes.length]);
  }
}
