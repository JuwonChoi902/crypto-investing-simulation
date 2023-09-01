import { testModules } from '../src/utils/functions';
import { CommentDataType } from '../src/typing/types';

const makeEdgeComments = () => {
  const temp: CommentDataType[] = [];
  for (let i = 3; i <= 10003; i += 1) {
    temp.push({
      id: i,
      comment: '1만개',
      replyId: 3,
      created_at: '2021-08-31T15:00:00.000Z',
      deleted_at: null,
      user: {
        id: 1,
        nickname: '기석',
        description: '백엔드 개발자 장기석입니다.',
        profileImage:
          'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
      },
    });
  }
  return temp;
};
const edgeCase = makeEdgeComments();

describe('should pass all function tests', () => {
  const mockLocalStorage = {
    store: {} as { [key: string]: string },
    getItem(key: string) {
      return this.store[key];
    },
    setItem(key: string, value: string) {
      this.store[key] = value.toString();
    },
    clear() {
      this.store = {};
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });
  test('makeHeader function should work correctly', () => {
    const makeHeaderTestCase = [
      {
        loginUserToken: 'mockAccessToken',
        expected: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: 'Bearer mockAccessToken',
        },
      },
      {
        loginUserToken: null,
        expected: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    ];
    makeHeaderTestCase.forEach((test) => {
      expect(testModules.makeHeaders(test.loginUserToken)).toEqual(test.expected);
    });
  });

  test('unitParsing funciton should work correctly', () => {
    const unitParsingTestCase = [
      { input: '1500000000', expected: '1.50B' },
      { input: '2300000', expected: '2.30M' },
      { input: '9800', expected: '9.80K' },
      { input: '500', expected: '500.00' },
      { input: '3500000.12345', expected: '3.50M' },
      { input: '4567890123.456', expected: '4.57B' },
      { input: '999999999999', expected: '1,000.00B' },
    ];

    unitParsingTestCase.forEach((test) => {
      expect(testModules.unitParsing(test.input)).toBe(test.expected);
    });
  });

  test('dateParsing function should work correctly', () => {
    const dateParsingTestCase = [
      {
        input: '2023-07-25T04:28:00.893Z',
        expected: ['2023.07.25. 13:28', false],
      },
      {
        input: '2023-07-23T09:00:00',
        expected: ['2023.07.23. 09:00', false],
      },
    ];

    dateParsingTestCase.forEach((test) => {
      expect(testModules.dateParsing(test.input)).toEqual(test.expected);
    });
  });

  test('dateParsingForList function should work correctly', () => {
    const dateParsingTestCase = [
      {
        input: '2023-07-25T04:28:00.893Z',
        expected: ['2023.07.25.', false],
      },
      {
        input: String(new Date()),
        expected: ['', false],
      },
    ];

    dateParsingTestCase.forEach((test, index) => {
      if (index === 1) {
        expect(testModules.dateParsingForList(test.input)[1]).toEqual(true);
      } else {
        expect(testModules.dateParsingForList(test.input)).toEqual(test.expected);
      }
    });
  });

  test('handleCommentsData should handle comments data correctly', () => {
    const testData = [
      {
        id: 1,
        comment: 'Test comment 1',
        created_at: '2023-08-01T12:34:56Z',
        deleted_at: null,
        isItNew: true,
        replyId: 1,
        user: {
          id: 1,
          nickname: 'testUser',
          description: null,
          profileImage: '',
        },
      },
      {
        id: 2,
        comment: 'Test comment 2',
        created_at: '2023-08-01T12:34:56Z',
        deleted_at: null,
        isItNew: true,
        replyId: 1,
        user: {
          id: 1,
          nickname: 'testUser',
          description: null,
          profileImage: '',
        },
      },
    ];

    const setCommentCount = jest.fn();
    const memoizedDateParsing = jest.fn().mockReturnValue(['2023-08-01 12:34', true]);

    const result = testModules.handleCommentsData(testData, setCommentCount, memoizedDateParsing);

    expect(setCommentCount).toHaveBeenCalledWith(2);

    expect(result).toEqual([
      {
        comment: 'Test comment 1',
        id: 1,
        replyId: 1,
        deleted_at: null,
        created_at: '2023-08-01 12:34',
        isItNew: true,
        isThisOrigin: true,
        user: {
          description: null,
          id: 1,
          nickname: 'testUser',
          profileImage: '',
        },
      },
      {
        comment: 'Test comment 2',
        id: 2,
        replyId: 1,
        deleted_at: null,
        created_at: '2023-08-01 12:34',
        isItNew: true,
        isThisOrigin: false,
        user: {
          description: null,
          id: 1,
          nickname: 'testUser',
          profileImage: '',
        },
      },
    ]);
  });

  test('handleCommentsData should handle edge case comments data correctly', () => {
    const setCommentCount = jest.fn();
    const memoizedDateParsing = jest.fn().mockReturnValue(['2023-08-01 12:34', true]);

    const result = testModules.handleCommentsData(edgeCase, setCommentCount, memoizedDateParsing);

    expect(setCommentCount).toHaveBeenCalledWith(10001);
  });

  test('getPostListData should get data correctly', () => {
    const testData = [
      {
        id: 1,
        comment: 'Test comment 1',
        created_at: '2023-08-01T12:34:56Z',
        deleted_at: null,
        replyId: 1,
        user: {
          id: 1,
          nickname: 'testUser',
          description: null,
          profileImage: '',
        },
      },
      {
        id: 2,
        comment: 'Test comment 2',
        created_at: '2023-08-01T12:34:56Z',
        deleted_at: null,
        replyId: 1,
        user: {
          id: 1,
          nickname: 'testUser',
          description: null,
          profileImage: '',
        },
      },
    ];
    const setCommentCount = jest.fn();

    const result = testModules.handleCommentsData(testData, setCommentCount, testModules.dateParsing);

    expect(setCommentCount).toHaveBeenCalledWith(2);

    expect(result).toEqual([
      {
        comment: 'Test comment 1',
        id: 1,
        replyId: 1,
        deleted_at: null,
        created_at: '2023.08.01. 21:34',
        isItNew: false,
        isThisOrigin: true,
        user: {
          description: null,
          id: 1,
          nickname: 'testUser',
          profileImage: '',
        },
      },
      {
        comment: 'Test comment 2',
        id: 2,
        replyId: 1,
        deleted_at: null,
        created_at: '2023.08.01. 21:34',
        isItNew: false,
        isThisOrigin: false,
        user: {
          description: null,
          id: 1,
          nickname: 'testUser',
          profileImage: '',
        },
      },
    ]);
  });

  test('getPostListData function works correctly', async () => {
    const setPostNumber = jest.fn();
    const setPosts = jest.fn();

    localStorage.setItem('accessToken', 'mock-token');
    const loginUserToken = localStorage.getItem('accessToken');
    const headers = testModules.makeHeaders(loginUserToken);

    const unprocessedPostData = [
      {
        id: 5,
        title: '게시글 제목',
        description: '게시글 내용',
        hits: 200,
        categoryId: 1,
        isPublished: true,
        created_at: '2023-07-27T11:26:24.524Z',
        repliesCount: 10,
        user: {
          id: 1,
          nickname: '기석',
          description: '백엔드 개발자 장기석입니다.',
          profileImage:
            'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
        },
      },
    ];

    const mockFetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isSuccess: true,
            data: {
              post: unprocessedPostData,
              number: 20,
            },
          }),
      }),
    );

    global.fetch = mockFetch;
    testModules.getPostListData(false, 1, 0, 0, 'nickname', 'test', headers, setPostNumber, setPosts);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://server.pien.kr:4000/community?page=1&number=10&categoryId=0',
      {
        headers: [
          ['Content-Type', 'application/json;charset=utf-8'],
          ['Authorization', 'Bearer mock-token'],
        ],
      },
    );

    mockFetch.mockReset().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isSuccess: true,
            data: {
              post: unprocessedPostData,
              number: 20,
            },
          }),
      }),
    );

    testModules.getPostListData(true, 2, 1, 1, 'nickname', 'test', headers, setPostNumber, setPosts);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://server.pien.kr:4000/community?page=2&number=10&categoryId=1&filter=nickname&search=test',
      {
        headers: [
          ['Content-Type', 'application/json;charset=utf-8'],
          ['Authorization', 'Bearer mock-token'],
        ],
      },
    );
  });

  test('getPostData function works correctly', () => {
    const fetchData = {
      isSuccess: true,
      data: {
        id: 6,
        title: '게시글 제목',
        description: '게시글 내용',
        hits: 50,
        categoryId: 1,
        created_at: '2023-08-06T07:59:29.685Z',
        repliesCount: 20,
        isLike: true,
        likeCount: 20,
        isPublished: true,
        unLikeCount: 10,
        prevPostId: 5,
        nextPostId: 7,
        user: {
          id: 1,
          nickname: '기석',
          description: '백엔드 개발자 장기석입니다.',
          profileImage:
            'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
        },
      },
    };

    const mockFetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fetchData),
      }),
    );
    global.fetch = mockFetch;

    localStorage.setItem('accessToken', 'mock-token');
    const loginUserToken = localStorage.getItem('accessToken');

    const headers = testModules.makeHeaders(loginUserToken);
    const setPostData = jest.fn();

    testModules.getPostData('GET', '1', headers, undefined, setPostData);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('https://server.pien.kr:4000/community/1', {
      body: undefined,
      headers: [
        ['Content-Type', 'application/json;charset=utf-8'],
        ['Authorization', 'Bearer mock-token'],
      ],
      method: 'GET',
    });

    mockFetch.mockReset().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fetchData),
      }),
    );

    testModules.getPostData('POST', '1', headers, true, setPostData);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('https://server.pien.kr:4000/community/like/1', {
      body: '{"isLike":true}',
      headers: [
        ['Content-Type', 'application/json;charset=utf-8'],
        ['Authorization', 'Bearer mock-token'],
      ],
      method: 'POST',
    });
  });
});
