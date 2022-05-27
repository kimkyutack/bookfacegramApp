import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import TopMyBooksMain from './home-main/TopMybooksMain';
import TopMyBooksList from './home-list/TopMyBooksList';
import TopNewBooksDetail from './home-detail/TopNewBooksDetail';
import {dialogOpenAction, dialogError} from '../../redux/dialog/DialogActions';
import {requestGet, requestPost} from '../../services/network';
import consts from '../../libs/consts';

export default function TopMyBooks({route}) {
  const user = useSelector(s => s.user, shallowEqual);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [genre, setGenre] = useState([]);
  const [rank, setRank] = useState([]);
  const [topic, setTopic] = useState([]);
  const [start, setStart] = useState(15);
   const fetchRequested = async (selecttype) => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/mybooks',
        query: {
          endPaging: 15,
          startPaging: 0,
          type: selecttype,
        },
      });
      if (status === 'SUCCESS') {
        if(data.length < 30){
          reMybooks('genre');
          reMybooks('rank');
          reMybooks('topic');
        }else{
            setLoading(false);
          if(selecttype === 'genre'){
              setGenre([...data]);
          }else if(selecttype === 'rank'){
              setRank([...data]);
          }else if(selecttype === 'topic'){
              setTopic([...data]);
          }
        }
      }
     
      return status;
    } catch (error) {
       
      //dispatch(dialogError(error));
    }
  };

  const reMybooks = async (selecttype) => {
    try {
      setLoading(true);
      const {data, status} = await requestGet({
        url: consts.apiUrl + '/mybooks',
        query: {
          endPaging: 30,
          startPaging: 0,
          type: selecttype,
        },
      });
      if (status === 'SUCCESS') {
          setStart(30);
          setLoading(false);
          if(selecttype === 'genre'){
              setGenre([...data]);
          }else if(selecttype === 'rank'){
              setRank([...data]);
          }else if(selecttype === 'topic'){
              setTopic([...data]);
          }
      }
     
      return status;
    } catch (error) {
       
      //dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    fetchRequested('genre');
    fetchRequested('rank');
    fetchRequested('topic');

    
    return () => {
      setLoading(true);
      setGenre([]);
      setRank([]);
      setTopic([]);
    };
  }, []);

  return (
    <View style={styles.root}>
      {loading ? (
        <></>
      ) : !loading && route.params.type === 'main' ? (
        <TopMyBooksMain route={route} genre={genre} rank={rank} topic={topic}/>
      ) : !loading && route.params.type === 'mylist' ? (
        <TopMyBooksList
          route={route}
          genre={genre} 
          rank={rank} 
          topic={topic}
          startPage={start}
        />
      ) : !loading && route.params.type === 'detail' ? (
        <TopNewBooksDetail route={route} />
      ) : (
        <></>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
