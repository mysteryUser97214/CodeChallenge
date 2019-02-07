import removeDuplicates from './removeDuplicates';
import testData from './testData/index';

describe('Duplicate removal utility', () => {
  it('Should exist', () => {
    expect(typeof removeDuplicates).toBe('function');
  });

  it('Should output a valid object', () => {
    const results = removeDuplicates(testData.leads.data);
    expect(typeof results).toBe('object');
  });

  it('Should remove a record with a duplicate id', () => {
    const data = {
      friends: [
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
      ],
    };

    const expected = {
      friends: [
        {
          _id: '123',
          email: 'rosie@rosie.com',
          entryDate: '2014-06-07T17:30:20+00:00',
        },
      ],
    };

    const results = removeDuplicates(data);
    expect(results.data).toEqual(expected);
  });

  it('Should remove a record with a duplicate email', () => {
    const data = {
      contacts: [
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
      ],
    };

    const expected = {
      contacts: [
        {
          _id: '123',
          email: 'rosie@rosie.com',
          entryDate: '2014-06-07T17:30:20+00:00',
        },
      ],
    };

    const results = removeDuplicates(data);
    expect(results.data).toEqual(expected);
  });

  it('Should handle records with both duplicate ids and emails', () => {
    const data = {
      buddies: [
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
      ],
    };

    const expected = {
      buddies: [
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
      ],
    };

    const results = removeDuplicates(data);
    expect(results.data).toEqual(expected);
  });

  it('Should handle individual records with multiple duplicate properties', () => {
    const data = {
      pals: [
        {
          _id: '123',
          email: 'bob@bob.com',
          entryDate: '2014-06-07T17:30:20+00:00',
        },
        {
          _id: '123',
          email: 'bob@bob.com',
          entryDate: '2014-09-07T17:30:20+00:00',
        },
        {
          _id: '123',
          email: 'bob@bob.com',
          entryDate: '2014-05-07T17:30:20+00:00',
        },
      ],
    };

    const expected = {
      pals: [
        {
          _id: '123',
          email: 'bob@bob.com',
          entryDate: '2014-09-07T17:30:20+00:00',
        },
      ],
    };

    const results = removeDuplicates(data);
    expect(results.data).toEqual(expected);
  });

  it('Should handle duplicate properties with identical entryDates', () => {
    const data = {
      leads: [
        {
          _id: '456',
          email: 'g.freeman@blackmesa.tk',
          entryDate: '2015-06-07T17:30:20+00:00',
        },
        {
          _id: '123',
          email: 'bob@bob.com',
          entryDate: '2014-06-07T17:30:20+00:00',
        },
        {
          _id: '123',
          email: 'hank@globex.com',
          entryDate: '2014-06-07T17:30:20+00:00',
        },
        {
          _id: '789',
          email: 'g.freeman@blackmesa.tk',
          entryDate: '2015-06-07T17:30:20+00:00',
        },
      ],
    };

    const expected = {
      leads: [
        {
          _id: '123',
          email: 'hank@globex.com',
          entryDate: '2014-06-07T17:30:20+00:00',
        },
        {
          _id: '789',
          email: 'g.freeman@blackmesa.tk',
          entryDate: '2015-06-07T17:30:20+00:00',
        },
      ],
    };

    const results = removeDuplicates(data);
    expect(results.data).toEqual(expected);
  });

  it('Should handle edge case scenario', () => {
    const results = removeDuplicates(testData.edgeCase.data);
    expect(results.data).toEqual(testData.edgeCase.expected);
  });

  it('Should handle another edge case scenario', () => {
    const results = removeDuplicates(testData.edgeCase2.data);
    expect(results.data).toEqual(testData.edgeCase2.expected);
  });

  it('Should handle edge case scenario where a record has both duplicate properties', () => {
    const results = removeDuplicates(testData.edgeCase3.data);
    expect(results.data).toEqual(testData.edgeCase3.expected);
  });

  it('Should process friends.json as expected', () => {
    const results = removeDuplicates(testData.friends.data);
    expect(results.data).toEqual(testData.friends.expected);
  });

  it('Should process leads.json as expected', () => {
    const results = removeDuplicates(testData.leads.data);
    expect(results.data).toEqual(testData.leads.expected);
  });
});
