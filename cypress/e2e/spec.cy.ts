function getTimestampString() {
  const date = new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}`;
}

const testString = `cypress E2E test ${getTimestampString()}`;

const popularDummyCoins = [
  { id: 1, name: 'Bitcoin', nick: 'BTC', symbol: 'btcusdt', imgURL: '', quantity: 19365700 },
  { id: 2, name: 'Ethereum', nick: 'ETH', symbol: 'ethusdt', imgURL: '', quantity: 120350515 },
  { id: 3, name: 'TetherUS', nick: 'USDT', symbol: 'busdusdt', imgURL: '', quantity: 82160000000 },
  { id: 4, name: 'BNB', nick: 'BNB', symbol: 'bnbusdt', imgURL: '', quantity: 155900000 },
  { id: 5, name: 'USD coin', nick: 'USDC', symbol: 'usdcusdt', imgURL: '', quantity: 30390000000 },
];

const tenDummyCoins = [
  { id: 1, name: 'Bitcoin', nick: 'BTC', symbol: 'btcusdt', imgURL: '', quantity: 19365700 },
  { id: 2, name: 'Ethereum', nick: 'ETH', symbol: 'ethusdt', imgURL: '', quantity: 120350515 },
  { id: 3, name: 'TetherUS', nick: 'USDT', symbol: 'busdusdt', imgURL: '', quantity: 82160000000 },
  { id: 4, name: 'BNB', nick: 'BNB', symbol: 'bnbusdt', imgURL: '', quantity: 155900000 },
  { id: 5, name: 'USD coin', nick: 'USDC', symbol: 'usdcusdt', imgURL: '', quantity: 30390000000 },
  { id: 6, name: 'Ripple', nick: 'XRP', symbol: 'xrpusdt', imgURL: '', quantity: 100000000000 },
  { id: 7, name: 'Cardano', nick: 'ADA', symbol: 'adausdt', imgURL: '', quantity: 63000000000 },
  { id: 8, name: 'Dogecoin', nick: 'DOGE', symbol: 'dogeusdt', imgURL: '', quantity: 132670764300 },
  { id: 9, name: 'Polygon', nick: 'MATIC', symbol: 'maticusdt', imgURL: '', quantity: 9249469069 },
  { id: 10, name: 'Solana', nick: 'SOL', symbol: 'solusdt', imgURL: '', quantity: 260000000 },
];

const userData = {
  id: '15',
  nickname: '주원쓰',
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoicnlvbzYwNTNAZ21haWwuY29tIiwiaWF0IjoxNjkxMTU1NTcwLCJleHAiOjE2OTExNTczNzB9.e9pRG1YFJfr9yLrRYxOTvHGPy0F29K4kdVWS5aVtHJ0',
};

const defaultComponentsForMain = [
  '인기 가상화폐',
  '로그인',
  '회원가입',
  '구매하기',
  '커뮤니티',
  '도움이 필요하세요?',
  '부자가 되고 싶으세요?',
];

const defaultComponentsForCommunity = [
  '게시글 보기',
  '유저페이지',
  '전체글보기',
  '질문하기',
  '자랑하기',
  '공유하기',
  '잡담하기',
  '글 작성하기',
];

const defaultPostDetialComponents = [
  '수정',
  '삭제',
  '다음글',
  '목록',
  '댓글',
  'URL 복사',
  '좋아요',
  '싫어요',
  '글쓰기',
  '답글',
  '맨 위로',
];

const defaultComponentForProfile = [
  '작성글',
  '작성댓글',
  '댓글단 글',
  '좋아요한 글',
  '수익률',
  '삭제한 게시글',
];

describe('E2E test for CryptoBy', () => {
  it('connect to main page and connect to websocket successfully', () => {
    cy.visit('http://localhost:3000/');

    defaultComponentsForMain.forEach((component) => {
      cy.contains(component).should('exist');
    });

    // websocokets should connect and all the coin websocket data should mount within 2 seconds.
    // cy.wait(2000);

    // const webScoketUrl = popularDummyCoins.map(
    //   (coin) => `wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`,
    // );

    // webScoketUrl.forEach((url) => {
    //   cy.intercept('GET', url).as(`${url}-request`);
    // });

    // webScoketUrl.forEach((url) => {
    //   cy.wait(`@${url}-request`).then((interception) => {
    //     if (interception.response) expect(interception.response.statusCode).to.equal(101);
    //   });
    // });

    // should render popular coins after websocket connected
    popularDummyCoins.forEach((coin) => {
      cy.contains(coin.name).should('exist');
    });
  });

  it('register and login process should work correctly', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('회원가입').click();

    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.window()
      .its('localStorage')
      .should(
        'have.property',
        'accessToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoicnlvbzYwNTNAZ21haWwuY29tIiwiaWF0IjoxNjkxMTU1NTcwLCJleHAiOjE2OTExNTczNzB9.e9pRG1YFJfr9yLrRYxOTvHGPy0F29K4kdVWS5aVtHJ0',
      );
    cy.contains('CryptoBy').click();
    cy.contains('로그아웃').should('exist');
  });

  it('Market page components and websocket data should render correctly', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/');

    cy.contains('구매하기').click();
    cy.wait(3000);
    tenDummyCoins.forEach((coin) => {
      cy.contains(coin.name).should('exist');
    });

    cy.contains('Bitcoin').click();
    cy.contains('구매하기').should('exist');
    cy.contains('매도하기').should('exist');

    cy.contains('확인').click();
    cy.contains('전체글보기').should('exist');
  });

  it('community page menus and board components should render and work correctly', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/');

    cy.contains('커뮤니티').click();
    cy.url().should('include', 'list');
    defaultComponentsForCommunity.forEach((component) => {
      cy.contains(component).should('exist');
    });

    cy.contains('유저페이지').click();
    cy.url().should('include', 'profile');
    defaultComponentForProfile.forEach((component) => {
      cy.contains(component).should('exist');
    });

    cy.contains('게시글 보기').click();
    cy.get('[data-testid="whatislist-component"]').should('have.text', '전체글보기');
    cy.contains('전체글보기').should('have.css', 'font-weight', '700');
    cy.contains('자랑하기').click();
    cy.get('[data-testid="whatislist-component"]').should('have.text', '자랑하기');
    cy.contains('자랑하기').should('have.css', 'font-weight', '700');
    cy.contains('전체글보기').click();

    cy.intercept('GET', 'https://server.pien.kr:4000/community?page=2&number=10&categoryId=0').as('postList');
    cy.get('[data-test-id="page-component-2"]').click();
    cy.wait('@postList').then((interception) => {
      const query = new URLSearchParams(interception.request.url.split('?')[1]);
      expect(query.get('page')).to.equal('2');
    });
  });

  it('creating post process', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');

    cy.contains('글 작성하기').click();
    cy.url().should('include', 'posting');
    cy.contains('게시판 글쓰기').should('exist');
    cy.contains('등록').should('exist');
    cy.get('[name="title"]').should('exist');
    cy.get('[name="categoryId"]').should('exist');
    cy.get('[name="description"]').should('exist');

    cy.get('[name="title"]').type(testString);
    cy.get('[name="description"]').type(testString);
    cy.get('[name="categoryId"]').select('자랑');
    cy.contains('등록').click();

    cy.url().should('match', /\/\d+$/);
  });

  it('components and functions in post detail page', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');

    cy.get('[data-testid="postListTitle"]').eq(0).click();
    defaultPostDetialComponents.forEach((component) => {
      cy.contains(component).should('exist');
    });
    cy.get('[data-testid="title"]').should('have.text', testString);
    cy.get('[data-testid="description"]').should('have.text', testString);
    cy.get('[data-testid="board"]').should('have.text', '자랑하기');

    cy.contains('목록').click();
    cy.url().should('include', 'list');
    cy.go('back');

    cy.get('[data-testid="board"]').click();
    cy.url().should('include', 'list');
    cy.wait(100);
    cy.get('[data-testid="whatislist-component"]').should('have.text', '자랑하기');
    cy.contains('자랑하기').should('have.css', 'font-weight', '700');
    cy.go('back');

    cy.contains('URL 복사').click();
    cy.contains('URL이 복사되었습니다.').should('exist');

    cy.contains('좋아요').click();
    cy.contains('좋아요').should('have.css', 'font-weight', '700');
    cy.get('[data-testid="likeButton"]').should('have.text', '1');
    cy.contains('좋아요').click();
    cy.get('[data-testid="likeButton"]').should('have.text', '0');
    cy.contains('좋아요').should('have.css', 'font-weight', '400');
    cy.contains('싫어요').click();
    cy.get('[data-testid="dislikeButton"]').should('have.text', '1');
    cy.contains('싫어요').should('have.css', 'font-weight', '700');
    cy.contains('싫어요').click();
    cy.get('[data-testid="dislikeButton"]').should('have.text', '0');
    cy.contains('싫어요').should('have.css', 'font-weight', '400');
    cy.contains('좋아요').click();

    cy.get('[data-testid="descriptionbox-usernick"]').click();
    cy.get('ul').should('exist');
    cy.get('ul li:first').click();
    cy.url().should('include', 'profile');
    cy.go('back');

    cy.contains('주원쓰님의 게시글 더보기').click();
    cy.url().should('include', 'profile');
    cy.go('back');
  });

  it('editing post process', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');
    cy.get('[data-testid="postListTitle"]').eq(0).click();

    cy.contains('수정').click();
    cy.url().should('include', 'posting');
    cy.get('[name="title"]').should('have.value', testString);
    cy.get('[name="description"]').should('have.value', testString);
    cy.get('[name="categoryId"]').should('have.value', 2);
    cy.get('[name="title"]').type(` edited`);
    cy.get('[name="description"]').type(` edited`);
    cy.get('[name="categoryId"]').select('질문');
    cy.contains('수정').click();
    cy.url().should('match', /\/\d+$/);
    cy.get('[data-testid="title"]').should('have.text', `${testString} edited`);
    cy.get('[data-testid="description"]').should('have.text', `${testString} edited`);
    cy.get('[data-testid="board"]').should('have.text', '질문하기');
  });

  it('comment CRUD process', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');
    cy.get('[data-testid="postListTitle"]').eq(0).click();

    cy.contains('댓글').click();
    cy.get('[data-testid="commentsbox-component"]').should('be.visible');
    cy.get('[data-testid="commentPostTextArea"]').type(testString);
    cy.get('[data-testid="postButton"]').click();
    cy.get('[data-testid="commentCount"]').should('have.text', '1개');
    cy.get('[data-testid="isItNew"]').should('exist');
    cy.get('[data-testid="commentDesc"]').should('have.text', testString);
    cy.get('[data-testid="editThisComment"]').click();
    cy.get('[data-testid="editTextArea"]').should('exist');
    cy.get('[data-testid="editTextArea"]').should('have.value', testString);
    cy.get('[data-testid="editTextArea"]').type(` edited`);
    cy.get('[data-testid="editPostButton"]').click();
    cy.get('[data-testid="commentDesc"]').should('have.text', `${testString} edited`);
    cy.contains('답글쓰기').click();
    cy.get('[data-testid="replyTextArea"]').should('exist');
    cy.get('[data-testid="replyTextArea"]').type(`${testString} reply`);
    cy.get('[data-testid="replyPostButton"]').click();
    cy.get('[data-testid="commentDesc"]').eq(1).should('have.text', `${testString} reply`);
    cy.get('[data-testid="deleteThisComment"]').eq(0).click();
    cy.contains('삭제된 댓글입니다.').should('exist');
  });

  it('find post in postList', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');

    cy.get('[data-testid="postListTitle"]').eq(0).should('include.text', `${testString} edited`);
    cy.contains('질문하기').click();
    cy.get('[data-testid="postListTitle"]').eq(0).should('include.text', `${testString} edited`);
    cy.contains('자랑하기').click();
    cy.contains(`${testString} edited`).should('not.exist');
    cy.contains('전체글보기').click();
  });

  it('search process', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');

    cy.get('[data-testid="selectBox"]').click();
    cy.get('ul').should('exist');
    cy.get('ul li').eq(1).click();
    cy.get('input').type('주원쓰');
    cy.contains('검색').click();
    cy.get('[data-testid="postListTitle"]').eq(0).should('include.text', `${testString} edited`);
    cy.get('[data-testid="topBoardSelectBox"]').click();
    cy.get('ul').should('exist');
    cy.get('ul li').eq(1).click();
    cy.get('[data-testid="topFilterSelectBox"]').click();
    cy.get('ul').should('exist');
    cy.contains('제목 + 내용').click();
    cy.get('input').eq(0).clear().type(`${testString}`);
    cy.contains('검색').click();
    cy.contains(`${testString} edited`).should('exist');
    cy.get('[data-testid="postListTitle"]').eq(0).should('include.text', `${testString} edited`);
  });

  it('explore userprofile page', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');

    cy.get('[data-testid="postListUserNick"]').eq(0).click();
    cy.get('ul').should('exist');
    cy.contains('프로필보기').click();
    cy.url().should('include', 'profile');
    cy.get('[data-testid="profilePostTitle"]').should('exist');
    cy.get('[data-testid="profilePostTitle"]').should('include.text', `${testString} edited`);
    cy.get('[data-testid="profilePostTitle"]').eq(0).click();
    cy.url().should('match', /\/\d+$/);
    cy.go('back');
    cy.get('[data-testid="profileMenu-1"]').click();
    cy.contains(`${testString} reply`).should('exist');
    cy.contains(`${testString} reply`).click();
    cy.url().should('match', /\/\d+$/);
    cy.go('back');
    cy.contains('댓글단 글').click();
    cy.contains(`${testString} edited`).should('exist');
    cy.contains(`${testString} edited`).click();
    cy.url().should('match', /\/\d+$/);
    cy.go('back');
    cy.contains('좋아요한 글').click();
    cy.scrollTo('top');
    cy.contains(`${testString} edited`).should('exist');
    cy.get('input').eq(0).click();
    cy.contains('좋아요 취소').click();
    cy.contains(`${testString} edited`).should('not.exist');
  });

  it('delete post process', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');
    cy.get('[data-testid="postListTitle"]').eq(0).click();
    cy.scrollTo('top');
    cy.contains('삭제').click();
    cy.url().should('include', 'list');
    cy.contains(`${testString} edited`).should('not.exist');
    cy.contains('유저페이지').click();
    cy.contains('삭제한 게시글').click();
    cy.contains(`${testString} edited`).should('exist');
  });

  it('components should render correctly when accessToken is not found', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.visit('http://localhost:3000/community/list');
    cy.contains('로그아웃').click();
    cy.url().should('include', 'login');
    cy.scrollTo('top');
    cy.contains('커뮤니티').click();
    cy.contains('글 작성하기').click();
    cy.url().should('include', 'login');
    cy.contains('커뮤니티').click();
    cy.get('[data-testid="postListTitle"]').eq(0).click();
    cy.get('textarea').should('have.attr', 'placeholder', '로그인 후 이용 가능합니다.');
    cy.contains('좋아요').click();
    cy.url().should('include', 'login');
    cy.contains('커뮤니티').click();
    cy.contains('유저페이지').click();
    cy.url().should('include', 'login');
  });
});
