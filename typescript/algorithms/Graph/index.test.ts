import { Graph } from './';

describe('Graph - datastructure', () => {
    test('Add graph nodes and edge', () => {
        const g = new Graph();
        g.addNode('a');

        expect(g.getNode('a').key).toEqual('a');
        expect(g.getNode('a').neighbours).toEqual([]);

        g.addNode('b');
        g.addEdge('a', 'b', 5);

        expect(g.getEdge('a', 'b')).toEqual(5);
        expect(g.getNode('a').neighbours[0].key).toEqual('b');
    });
});

describe('Graph - algorithms', () => {
    const g = new Graph();

    const nodes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const routes = {
        'a|c': 2,
        'c|d': 1,
        'c|f': 4,
        'b|d': 4,
        'b|e': 7,
        'd|f': 1,
        'd|g': 1,
        'f|g': 3,
        'g|h': 4,
        'e|h': 10,
    };

    nodes.forEach(node => g.addNode(node));
    Object.entries(routes).forEach(
        ([routes, distance]: [string, number]) => {
            const [start, destination] = routes.split('|');
            g.addEdge(start, destination, distance);
        },
    );

    test('dijkstra - a', () => {
        const expectedResults = {
            a: { distance: 0, previous: null },
            b: { distance: 7, previous: 'd' },
            c: { distance: 2, previous: 'a' },
            d: { distance: 3, previous: 'c' },
            e: { distance: 14, previous: 'b' },
            f: { distance: 4, previous: 'd' },
            g: { distance: 4, previous: 'd' },
            h: { distance: 8, previous: 'g' },
        };

        expect(g.dijkstra('a')).toEqual(expectedResults);
    });

    test('dijkstra - e', () => {
        const expectedResults = {
            a: { distance: 14, previous: 'c' },
            b: { distance: 7, previous: 'e' },
            c: { distance: 12, previous: 'd' },
            d: { distance: 11, previous: 'b' },
            e: { distance: 0, previous: null },
            f: { distance: 12, previous: 'd' },
            g: { distance: 12, previous: 'd' },
            h: { distance: 10, previous: 'e' },
        };

        expect(g.dijkstra('e')).toEqual(expectedResults);
    });

    test('A -> F', () => {
        const expected = ['a', 'c', 'd', 'f'];
        const result = g.findPath('a', 'f');

        expect(result).toEqual(expected);
    });

    test('A -> H', () => {
        const expected = ['a', 'c', 'd', 'g', 'h'];
        const result = g.findPath('a', 'h');

        expect(result).toEqual(expected);
    });

    test('B -> H', () => {
        const expected = ['b', 'd', 'g', 'h'];
        const result = g.findPath('b', 'h');

        expect(result).toEqual(expected);
    });

    test('H -> D', () => {
        const expected = ['h', 'g', 'd'];
        const result = g.findPath('h', 'd');

        expect(result).toEqual(expected);
    });

    test('throw error when given unknown source node', () => {
        expect(() => g.findPath('z', 'd')).toThrowError(
            'Could not find source node z',
        );
    });

    test('throw error when given unknown destination node', () => {
        expect(() => g.findPath('a', 'z')).toThrowError(
            'Could not find source node z',
        );
    });
});
