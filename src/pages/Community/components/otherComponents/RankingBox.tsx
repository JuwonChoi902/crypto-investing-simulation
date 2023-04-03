import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import user from '../../images/user.png';

interface RankingUsers {
  id: number;
  nickname: string;
  ranking: number;
  incomePercent: number;
  incomeMoney: number;
}

const UserList: RankingUsers[] = [
  { id: 1, nickname: 'goodjob123', ranking: 1, incomePercent: 145, incomeMoney: 1 },
  { id: 2, nickname: 'rltjrWkdWkd', ranking: 2, incomePercent: 140, incomeMoney: 1 },
  { id: 3, nickname: 'juwon123', ranking: 3, incomePercent: 135, incomeMoney: 1 },
  { id: 4, nickname: 'nerdcloud09', ranking: 4, incomePercent: 130, incomeMoney: 1 },
  { id: 5, nickname: 'icanwinthis123', ranking: 5, incomePercent: 125, incomeMoney: 1 },
  { id: 6, nickname: 'hohoho', ranking: 6, incomePercent: 120, incomeMoney: 1 },
  { id: 7, nickname: 'appleowner17', ranking: 7, incomePercent: 115, incomeMoney: 1 },
  { id: 8, nickname: 'carsalerRich', ranking: 8, incomePercent: 110, incomeMoney: 1 },
  { id: 9, nickname: 'youAneMe2233', ranking: 9, incomePercent: 105, incomeMoney: 1 },
  { id: 10, nickname: 'yoonah95', ranking: 10, incomePercent: 100, incomeMoney: 1 },
];

export default function RankingBox() {
  const [topTen, setTopTen] = useState<RankingUsers[]>();

  useEffect(() => {
    fetch(`http://pien.kr:4000/ranking/incomepercent`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((data) => setTopTen(data));
  }, []);

  return (
    <OuterBox>
      <FilterTap>
        <Following>팔로잉</Following>
        <ShowRanks>랭킹</ShowRanks>
        <ShowMyRank>내랭킹</ShowMyRank>
      </FilterTap>
      <RankBox>
        {UserList?.map((el) => (
          <Rank key={el.id}>
            <UserImg>
              <img src={user} alt='user' />
            </UserImg>
            <UserRank>{el.ranking}위</UserRank>
            <UserNick>{el.nickname}</UserNick>
            <UserRate>{Math.floor(el.incomePercent)}%</UserRate>
          </Rank>
        ))}
      </RankBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 200px;
  border-top: 2px solid black;
`;
const FilterTap = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: bold;
  padding: 9px 0px;
  border-bottom: 1px solid #e5e5e5;
`;
const Following = styled.div`
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowRanks = styled.div`
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowMyRank = styled.div`
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const RankBox = styled.div`
  padding: 5px 0;
  border-bottom: 2px solid black;
`;
const UserNick = styled.div`
  margin-right: 5px;
  &:hover {
    cursor: pointer;
  }
`;
const Rank = styled.div`
  display: flex;
  font-size: 14px;
  padding: 5px 0 5px 0;

  &:hover ${UserNick} {
    text-decoration: underline;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const UserImg = styled.div`
  margin-right: 5px;
  img {
    width: 16px;
    opacity: 0.2;
  }
`;
const UserRank = styled.div`
  margin-right: 5px;
`;

const UserRate = styled.div`
  font-weight: bold;
`;
