import removeDuplicates from './removeDuplicates';
// import { leads } from '../data/leads.json';

describe('Duplicate removal utility', () => {
  it('Should exist', () => {
    expect(typeof removeDuplicates).toBe('function');
  });

  it('Should output a valid object', () => {
    const result = removeDuplicates([]);
    expect(typeof result).toBe('object');
  });

  it('Should remove a record with a duplicate _id', () => {
    const data = [
      {
        _id: '123',
        email: 'rosie@rosie.com',
        entryDate: '2014-06-07T17:30:20+00:00',
      },
      {
        _id: '123',
        email: 'susan@susan.com',
        entryDate: '2014-05-07T17:30:20+00:00',
      },
    ];

    const expected = [
      {
        _id: '123',
        email: 'rosie@rosie.com',
        entryDate: '2014-06-07T17:30:20+00:00',
      },
    ];

    const result = removeDuplicates(data);
    expect(result).toEqual(expected);
  });

  it('Should remove a record with a duplicate email', () => {
    const data = [
      {
        _id: '123',
        email: 'rosie@rosie.com',
        entryDate: '2014-06-07T17:30:20+00:00',
      },
      {
        _id: '456',
        email: 'rosie@rosie.com',
        entryDate: '2014-05-07T17:30:20+00:00',
      },
    ];

    const expected = [
      {
        _id: '123',
        email: 'rosie@rosie.com',
        entryDate: '2014-06-07T17:30:20+00:00',
      },
    ];

    const result = removeDuplicates(data);
    expect(result).toEqual(expected);
  });
});
