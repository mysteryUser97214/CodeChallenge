import removeDuplicates from './removeDuplicates';
// import { leads } from '../data/leads.json';

describe('Duplicate removal utility', () => {
  it('Should exist', () => {
    expect(typeof removeDuplicates).toBe('function');
  });

  it('Should output a valid array', () => {
    const results = removeDuplicates([]);
    expect(typeof results).toBe('object');
  });

  it('Should remove a record with a duplicate id', () => {
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

    const results = removeDuplicates(data);
    expect(results).toEqual(expected);
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

    const results = removeDuplicates(data);
    expect(results).toEqual(expected);
  });

  it('should handle records with both duplicate ids and emails', () => {
    const data = [
      {
        _id: '123',
        email: 'rosie@rosie.com',
        entryDate: '2014-06-07T17:30:20+00:00',
      },
      {
        _id: '456',
        email: 'bob@bob.com',
        entryDate: '2014-05-07T17:30:20+00:00',
      },
      {
        _id: '123',
        email: 'gurdy@gurdy.com',
        entryDate: '2014-09-07T17:30:20+00:00',
      },
      {
        _id: '789',
        email: 'bob@bob.com',
        entryDate: '2018-05-07T17:30:20+00:00',
      },
    ];

    const expected = [
      {
        _id: '123',
        email: 'gurdy@gurdy.com',
        entryDate: '2014-09-07T17:30:20+00:00',
      },
      {
        _id: '789',
        email: 'bob@bob.com',
        entryDate: '2018-05-07T17:30:20+00:00',
      },
    ];

    const results = removeDuplicates(data);
    expect(results).toEqual(expected);
  });
});
