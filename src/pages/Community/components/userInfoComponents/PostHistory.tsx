import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import pageLeft from '../../images/pageLeft.png';
import pageRight from '../../images/pageRight.png';

interface PostDetail {
  id: number;
  title: string;
  description: string;
  created_at: string;
  repliesCount: number;
  hits: number;
  label: string;
  categoryId: number;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

type PostHistoryProps = {
  profileId: number | undefined;
};

export default function PostHistory({ profileId }: PostHistoryProps) {
  const [checked, setChecked] = useState<number[]>([]);
  const [postsData, setPostsData] = useState<PostDetail[]>([]);
  const [postNumber, setPostNumber] = useState<number>();
  const [pageNow, setPageNow] = useState<number>(1);

  const navigate = useNavigate();

  const dateParsing = (date: string): [string, boolean] => {
    const theDate = new Date(date);
    const todayDate = new Date();
    const oneDayPlus = new Date(date);
    oneDayPlus.setDate(oneDayPlus.getDate() + 1);
    const strTheDate = theDate.toLocaleString();
    const strTodayDate = todayDate.toLocaleString();
    const isItInOneDay = oneDayPlus >= todayDate;

    if (
      strTheDate.slice(0, strTheDate.indexOf('오') - 1) !==
      strTodayDate.slice(0, strTodayDate.indexOf('오') - 1)
    ) {
      return [
        `${theDate.getFullYear()}.${String(theDate.getMonth() + 1).padStart(2, '0')}.${String(
          theDate.getDate(),
        ).padStart(2, '0')}.`,
        isItInOneDay,
      ];
    }
    return [
      `${String(theDate.getHours()).padStart(2, '0')}:${String(theDate.getMinutes()).padStart(2, '0')}`,
      isItInOneDay,
    ];
  };

  useEffect(() => {
    fetch(`http://pien.kr:4000/community/post/user/${profileId}?page=${pageNow}&number=15`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPostNumber(data.number);
        setPostsData(data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })));
      });
  }, [pageNow]);

  const pagination = (number: number | undefined) => {
    const temp = number ? Math.ceil(number / 15) : undefined;
    const arr = [];
    if (temp) {
      let arrTemp: number[] = [];
      for (let i = 1; i <= temp; i += 1) {
        arrTemp.push(i);
        if (arrTemp.length === 3) {
          arr.push(arrTemp);
          arrTemp = [];
        }

        if (i === temp && arrTemp.length) arr.push(arrTemp);
      }
    }
    return arr;
  };

  const pages = pagination(postNumber);
  const pageIndex = pageNow % 3 ? Math.floor(pageNow / 3) : pageNow / 3 - 1;
  const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked.includes(Number(event.target.id))) {
      const temp = checked.filter((el) => el !== Number(event.target.id));
      setChecked(temp);
    } else {
      setChecked([...checked, Number(event.target.id)]);
    }
  };

  const checkAll = () => {
    if (checked.length !== postsData.length) {
      const temp: number[] = [];
      postsData.forEach((el) => {
        temp.push(el.id);
      });
      setChecked(temp);
    } else {
      setChecked([]);
    }
  };

  const deleteChecked = () => {
    if (window.confirm('선택된 게시글을 삭제하시겠습니까?') === true) {
      fetch(`http://pien.kr:4000/community/post`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ postId: checked }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === true) {
            fetch(`http://pien.kr:4000/community/post/user/${profileId}?page=${pageNow}&number=15`, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setPostNumber(data.number);
                setPostsData(
                  data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })),
                );
                setChecked([]);
              });
          }
        });
    }
    return null;
  };

  return (
    <OuterBox>
      <ListCategories>
        <LCTitle>제목</LCTitle>
        <LCDate>작성일</LCDate>
        <LCHit>조회</LCHit>
      </ListCategories>
      {postsData.length ? (
        <List>
          {postsData.map((post) => (
            <Post>
              <PostTitleBox>
                <CheckBox>
                  <input
                    type='checkBox'
                    id={String(post.id)}
                    checked={checked.includes(post.id)}
                    onChange={(event) => checkedChange(event)}
                  />
                </CheckBox>
                <PostId>{post.id}</PostId>
                <PostTitle>
                  {post.title}
                  {post.repliesCount === 0 ? null : <RepliesCount>[{post.repliesCount}]</RepliesCount>}
                  {post.created_at[1] ? <IsItNew>N</IsItNew> : null}
                </PostTitle>
              </PostTitleBox>
              <PostDate>{post.created_at}</PostDate>
              <PostHit>{post.hits}</PostHit>
            </Post>
          ))}
        </List>
      ) : (
        <EmptyList>작성한 게시글이 없습니다.</EmptyList>
      )}
      <ButtonAndPageBox>
        <SelectAll>
          <CheckAll onClick={checkAll}>
            <input type='checkBox' checked={checked.length === postsData.length} />
            <div>전체선택</div>
          </CheckAll>
        </SelectAll>
        <Pages>
          <PageLeft pageIndex={pageIndex} onClick={() => setPageNow((pageIndex - 1) * 3 + 1)}>
            <img src={pageLeft} alt='pageLeft' />
          </PageLeft>

          {pages[pageIndex]?.map((el) => (
            <Page pageNow={pageNow} id={el} onClick={() => setPageNow(el)}>
              {el}
            </Page>
          ))}
          <PageRight
            pagesLength={pages.length}
            pageIndex={pageIndex}
            onClick={() => setPageNow((pageIndex + 1) * 3 + 1)}
          >
            <img src={pageRight} alt='pageRight' />
          </PageRight>
        </Pages>
        <DeleteAndWrite>
          <DeleteBtn onClick={deleteChecked}>삭제</DeleteBtn>
          <WriteBtn onClick={() => navigate('/community/posting')}>글쓰기</WriteBtn>
        </DeleteAndWrite>
      </ButtonAndPageBox>
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const ListCategories = styled.div`
  display: flex;
  width: 860px;
  font-size: 13px;
  font-weight: bold;
  border-top: 1px solid black;
  border-bottom: 1px solid #e5e5e5;
`;
const LCTitle = styled.div`
  ${(props) => props.theme.variables.flex()};

  width: 660px;
  height: 45px;
`;

const LCDate = styled.div`
  ${(props) => props.theme.variables.flex()}
  width:120px;
  height: 45px;
`;
const LCHit = styled.div`
  ${(props) => props.theme.variables.flex()}
  width:80px;
  height: 45px;
`;

const List = styled.div``;
const Post = styled.div`
  display: flex;
  width: 860px;
  height: 37px;
  border-bottom: 1px solid #e5e5e5;
`;
const PostTitleBox = styled.div`
  width: 660px;
  display: flex;
`;
const CheckBox = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 30px;
  input {
    width: 14px;
    height: 14px;
    border: #e5e5e5;

    &:hover {
      cursor: pointer;
    }
  }
`;
const PostId = styled.div`
  ${(props) => props.theme.variables.flex()}
  color:#878787;
  width: 69px;
  font-size: 11px;
  margin-right: 6px;
`;
const PostTitle = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-size: 13px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const RepliesCount = styled.div`
  font-weight: bold;
  margin-left: 5px;
  color: ${(props) => props.theme.style.red};
`;

const IsItNew = styled.div`
  ${(props) => props.theme.variables.flex()};
  background-color: red;
  width: 12px;
  height: 12px;
  font-size: 10px;
  color: white;
  border-radius: 100%;
  margin-left: 5px;
`;

const PostDate = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 120px;
  font-size: 12px;
`;
const PostHit = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 80px;
  font-size: 12px;
`;

const EmptyList = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 860px;
  height: 37px;
  font-size: 13px;
  border-bottom: 1px solid #e5e5e5;
`;
const ButtonAndPageBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: 34px;
  margin: 10px 0px 34px 0px;
`;
const SelectAll = styled.div`
  ${(props) => props.theme.variables.flex()}
`;
const CheckAll = styled.div`
  ${(props) => props.theme.variables.flex()}
  display: flex;
  font-size: 13px;

  input {
    width: 14px;
    height: 14px;
    margin-left: 8px;
    margin-right: 12px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Pages = styled.div`
  margin-top: 30px;
  margin-right: 25px;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const PageLeft = styled.div<{ pageIndex: number }>`
  display: ${(props) => (props.pageIndex === 0 ? 'none' : 'flex')};

  img {
    width: 10px;
    height: 10px;

    &:hover {
      cursor: pointer;
    }
  }
`;
const PageRight = styled.div<{ pageIndex: number; pagesLength: number }>`
  display: ${(props) => (props.pageIndex === props.pagesLength - 1 ? 'none' : 'flex')};

  img {
    width: 10px;
    height: 10px;
    margin-left: 30px;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Page = styled.div<{ pageNow: number; id: any }>`
  font-weight: ${(props) => (props.pageNow === props.id ? 'bold' : 'normal')};
  margin-left: 25px;
  border: ${(props) => (props.pageNow === props.id ? '1px solid #e5e5e5' : 'none')};
  padding: 0 5px;
  color: ${(props) => (props.pageNow === props.id ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
  }
`;

const DeleteAndWrite = styled.div`
  display: flex;
`;
const DeleteBtn = styled.button`
  background-color: #eff0f2;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  &:hover {
    cursor: pointer;
  }
`;
const WriteBtn = styled.button`
  border: none;
  background-color: #eff0f2;
  margin-left: 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  &:hover {
    cursor: pointer;
  }
`;
