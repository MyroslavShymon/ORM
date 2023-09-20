export const test = (elements, field) => {
    return elements.map((element) => element[field]);
}

test([{name: 'foo'}], 'name')