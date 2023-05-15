// The basic code is from https://codepen.io/zarazum/pen/fjoqF and was then adjusted.

var width = 500;
var height = 500;
var colors = function () {
    return '#FFF';
};
var svg;
var nodes;
var links;
var force;
var drag_line;
var path;
var circle;
var selected_node;
var selected_link;
var mousedown_link;
var mousedown_node;
var mouseup_node;
var button;

function start(nodeList, nodeLinks) {
    let x = document.getElementsByClassName('serviceCard')[0];
    width = x.offsetWidth;
    let charge = nodeList.length * 500 * -1;

    if (!d3.select('svg').empty()) {
        svg = d3.select('.graph').select('svg');
        svg.remove();
    }

    svg = d3.select('.graph').append('svg').attr('width', '100%').attr('height', height);

    nodes = nodeList;
    links = nodeLinks;

    // init D3 force layout
    force = d3.layout
        .force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .linkDistance(200)
        .charge(charge)
        .on('tick', tick);

    // define arrow markers for graph links
    svg.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .attr('markerUnits', 'strokeWidth')
        .attr('stroke-width', '13')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000');

    svg.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .attr('markerUnits', 'strokeWidth')
        .attr('stroke-width', '13')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#000');

    // line displayed when dragging new nodes
    drag_line = svg.append('svg:path').attr('class', 'link dragline hidden').attr('d', 'M0,0L0,0');

    // handles to link and node element groups
    path = svg.append('svg:g').selectAll('path');
    circle = svg.append('svg:g').selectAll('g');
    button = svg.append('svg:g').selectAll('g');

    // mouse event vars
    selected_node = null;
    selected_link = null;
    mousedown_link = null;
    mousedown_node = null;
    mouseup_node = null;

    main();
}

function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}

// update force layout (called automatically each iteration)
// update graph (called when needed)
function restart() {
    path = path.data(links);

    // update existing links
    path.classed('selected', function (d) {
        return d === selected_link;
    })
        .style('marker-start', function (d) {
            return d.left ? 'url(#start-arrow)' : '';
        })
        .style('marker-end', function (d) {
            return d.right ? 'url(#end-arrow)' : '';
        });

    // add new links
    path.enter()
        .append('svg:path')
        .attr('class', 'link')
        .classed('selected', function (d) {
            return d === selected_link;
        })
        .style('marker-start', function (d) {
            return d.left ? 'url(#start-arrow)' : '';
        })
        .style('marker-end', function (d) {
            return d.right ? 'url(#end-arrow)' : '';
        })
        .on('mousedown', function (d) {
            if (d3.event.ctrlKey) return;
            // select link
            mousedown_link = d;
            if (mousedown_link === selected_link) selected_link = null;
            else selected_link = mousedown_link;
            selected_node = null;
            setTextInView(selected_link);
            restart();
        });

    // remove old links
    path.exit().remove();

    button = button.data(nodes, function (d) {
        return d.id;
    });

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(nodes, function (d) {
        return d.id;
    });

    // update existing nodes (reflexive & selected visual states)
    circle
        .selectAll('circle')
        .style('fill', function (d) {
            return d === selected_node ? d3.rgb(colors(d.id)).darker().toString() : colors(d.id);
        })
        .classed('reflexive', function (d) {
            return d.reflexive;
        });

    // add new nodes
    var g = circle.enter().append('svg:g');

    g.append('svg:circle')
        .attr('class', 'node')
        .attr('r', 40)
        .style('fill', function (d) {
            return d === selected_node ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);
        })
        .style('stroke', function (d) {
            return d3.rgb(colors(d.id)).darker().toString();
        })
        .classed('reflexive', function (d) {
            return d.reflexive;
        })
        .on('mouseover', function (d) {
            d3.select(this).attr('transform', 'scale(1.1)');
            if (!mousedown_node || d === mousedown_node) return;
            d3.select(this).attr('transform', 'scale(1.1)');
        })
        .on('mouseout', function (d) {
            if (d === selected_node || d === mousedown_node) return;
            d3.select(this).attr('transform', 'scale(0.99)');
            // unenlarge target node
        })
        .on('mousedown', function (d) {
            if (d3.event.ctrlKey) return;
            // select node
            mousedown_node = d;
            if (mousedown_node === selected_node) {
                selected_node = null;
            } else selected_node = mousedown_node;
            selected_link = null;
            if (selected_node != null) {
                sendToModelNode(selected_node);
            }
            // reposition drag line
            drag_line
                .style('marker-end', 'url(#end-arrow)')
                .classed('hidden', false)
                .attr(
                    'd',
                    'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y,
                );
            restart();
        })
        .on('mouseup', function (d) {
            if (!mousedown_node) return;
            drag_line.classed('hidden', true).style('marker-end', '');
            // check for drag-to-self
            mouseup_node = d;
            if (mouseup_node === mousedown_node) {
                resetMouseVars();
                return;
            }

            var source, target;
            source = mousedown_node;
            target = mouseup_node;

            // var link;
            // link = links.filter(function (l) {
            //   return (l.source === source && l.target === target);
            // })[0];

            link = { source: source, target: target, left: false, right: true };
            links.push(link);
            addLinkToDB(link);

            // select new link
            selected_link = link;
            selected_node = null;
            restart();
        });

    // show node IDs
    g.append('svg:text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('class', 'id')
        .text(function (d) {
            return shortenName(d.id);
        });

    // remove old nodes
    circle.exit().remove();

    // set the graph in motion
    force.start();
}

function shortenName(s) {
    if (s.length > 10) {
        return s.substring(0, Math.min(s.length, 10)) + '...';
    } else {
        return s;
    }
}

function tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', function (d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = d.left ? 45 : 12,
            targetPadding = d.right ? 45 : 12,
            sourceX = d.source.x + sourcePadding * normX,
            sourceY = d.source.y + sourcePadding * normY,
            targetX = d.target.x - targetPadding * normX,
            targetY = d.target.y - targetPadding * normY;
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    });

    circle.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });
}

function mousedown() {
    // because :active only works in WebKit?
    svg.classed('active', true);
    if (d3.event.ctrlKey || mousedown_node || mousedown_link) return;
    restart();
}

function mousemove() {
    if (!mousedown_node) return;
    // update drag line
    drag_line.attr(
        'd',
        'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1],
    );
    restart();
}

function mouseup() {
    if (mousedown_node) {
        // hide drag line
        drag_line.classed('hidden', true).style('marker-end', '');
    }
    // because :active only works in WebKit?
    svg.classed('active', false);
    // clear mouse event vars
    resetMouseVars();
}

function spliceLinksForNode(node) {
    var toSplice = links.filter(function (l) {
        return l.source === node || l.target === node;
    });
    toSplice.map(function (l) {
        links.splice(links.indexOf(l), 1);
    });
}

// only respond once per keydown
var lastKeyDown = -1;

function keydown() {
    //d3.event.preventDefault();

    if (lastKeyDown !== -1) return;
    lastKeyDown = d3.event.keyCode;

    // ctrl
    if (d3.event.keyCode === 17) {
        circle.call(force.drag);
        svg.classed('ctrl', true);
    }
}

// Is used in the graph.ts file
function deleteLink() {
    if (selected_node) {
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
    } else if (selected_link) {
        links.splice(links.indexOf(selected_link), 1);
    }
    selected_link = null;
    selected_node = null;
    restart();
}

// Function for moving the nodes
function keyup() {
    lastKeyDown = -1;
    // ctrl
    if (d3.event.keyCode === 17) {
        circle.on('mousedown.drag', null).on('touchstart.drag', null);
        svg.classed('ctrl', false);
    }
}

function sendToModelNode(node) {
    document.getElementById('testText').innerText = node.id;
    document.getElementById('IdText').innerText = node.idNumber;
    document.getElementById('typeText').innerText = 'Node:';
}

function setTextInView(link) {
    document.getElementById('typeText').innerText = 'Link:';
    document.getElementById('IdLinkStart').innerText = link.source.idNumber;
    document.getElementById('IdLinkTarget').innerText = link.target.idNumber;
    document.getElementById('testText').innerText =
        'Link between "' + link.source.id + '" and "' + link.target.id + '"';
}

function addLinkToDB(link) {
    setTextInView(link);
    document.getElementById('configureLink').click();
}

// Starts the Graph
function main() {
    this.svg.on('mousedown', this.mousedown).on('mousemove', mousemove).on('mouseup', mouseup);
    d3.select(window).on('keydown', keydown).on('keyup', keyup);
    this.restart();
}
