import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import colors from '../../../libs/colors';
import TextButton from '../../../components/text-button/TextButton';
import TextWrap from '../../../components/text-wrap/TextWrap';
import images from '../../../libs/images';
import fonts from '../../../libs/fonts';
import {
  screenWidth,
  widthPercentage,
  chunk,
  fontPercentage,
  heightPercentage,
} from '../../../services/util';
import MyBookCarousel from './MyBookCarousel';
import NoMybooks from './NoMybooks';
import {ScrollView} from 'react-native-gesture-handler';
import {navigate} from '../../../services/navigation';
import routes from '../../../libs/routes';
import { set } from 'react-native-reanimated';
import RadarCharts from '../../../components/chart/RadarCharts';

export default function TopMyBooksMain({route, genre, rank, topic}) {
  const [loading, setLoading] = useState(true);
  const user = useSelector(s => s.user, shallowEqual);
  const dispatch = useDispatch();
  const [select , setSelect] = useState('genre');
  const [listData, setListData] = useState([
    {
      
      name: 'genre',
      renderData1: genre.slice(0,15),
      renderData2: genre.slice(15),
      itemWidth: widthPercentage(332),
      slideWidth: widthPercentage(332),
      pagination: true,
      header: false,
    },
    {
      name: 'genre',
      renderData1: genre.slice(0,15) ? chunk(genre.slice(0,15), 3) : genre.slice(0,15),
      renderData2: genre.slice(15) ? chunk(genre.slice(15), 3) : genre.slice(15),
      itemWidth: (widthPercentage(332) / 3).toFixed(1) * 1 - 10,
      slideWidth: widthPercentage(344),
      grade: null,
      pagination: false,
      header: true,
    },
  ]);
  useEffect(() => {
    setLoading(false);
    select === 'genre' ? setListData([{
      name: 'genre',
      renderData1: genre.slice(0,15),
      renderData2: genre.slice(15),
      itemWidth: widthPercentage(332),
      slideWidth: widthPercentage(332),
      pagination: true,
      header: false,
    },
    {
      name: 'genre',
      renderData1: genre.slice(0,15) ? chunk(genre.slice(0,15), 3) : genre.slice(0,15),
      renderData2: genre.slice(15) ? chunk(genre.slice(15), 3) : genre.slice(15),
      itemWidth: (widthPercentage(332) / 3).toFixed(1) * 1 - 10,
      slideWidth: widthPercentage(344),
      grade: null,
      pagination: false,
      header: true,
    },])
    : select === 'rank' ? setListData([{
      name: 'rank',
      renderData1: rank.slice(0,15),
      renderData2: rank.slice(15),
      itemWidth: widthPercentage(332),
      slideWidth: widthPercentage(332),
      pagination: true,
      header: false,
    },
    {
      name: 'rank',
      renderData1: rank.slice(0,15) ? chunk(rank.slice(0,15), 3) : rank.slice(0,15),
      renderData2: rank.slice(15) ? chunk(rank.slice(15), 3) : rank.slice(15),
      itemWidth: (widthPercentage(332) / 3).toFixed(1) * 1 - 10,
      slideWidth: widthPercentage(344),
      grade: null,
      pagination: false,
      header: true,
    },])
    :  setListData([{
      name: 'topic',
      renderData1: topic.slice(0,15),
      renderData2: topic.slice(15),
      itemWidth: widthPercentage(332),
      slideWidth: widthPercentage(332),
      pagination: true,
      header: false,
    },
    {
      name: 'topic',
      renderData1: topic.slice(0,15) ? chunk(topic.slice(0,15), 3) : topic.slice(0,15),
      renderData2: topic.slice(15) ? chunk(topic.slice(15), 3) : topic.slice(15),
      itemWidth: (widthPercentage(332) / 3).toFixed(1) * 1 - 10,
      slideWidth: widthPercentage(344),
      grade: null,
      pagination: false,
      header: true,
    },])
  }, [select,genre,rank,topic]);


  
  return (
    
    <View style={[styles.root, loading && {flex: 1, justifyContent: 'center'}]}>
      {/* <View style={styles.cardHeader}>
        <TextWrap style={styles.userName}>{user.kor_nm} 님</TextWrap>
        <TextWrap style={styles.welcome}>
          을 위한 맞춤도서를 확인해보세요!
        </TextWrap>
      </View>
      <RadarCharts></RadarCharts>
      <View style={styles.cardHeader2}>
        
        <TouchableOpacity onPress={()=> {setSelect('genre')}} style={select === 'genre' ? styles.btn : styles.btn2}>
          <Text style={select === 'genre' ? styles.buttonText : styles.buttonText2}>장르별</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {setSelect('rank')}} style={select === 'rank' ? styles.btn : styles.btn2}>
          <Text style={select === 'rank' ? styles.buttonText : styles.buttonText2}>수준별</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {setSelect('topic')}} style={select === 'topic' ? styles.btn : styles.btn2}>
          <Text style={select === 'topic' ? styles.buttonText : styles.buttonText2}>주제별</Text>
        </TouchableOpacity>
              
      </View> */}

      {loading ? (
        <ActivityIndicator
          size="large"
          style={{alignSelf: 'center', marginBottom: 60}}
          color={colors.blue}
        />
      ) : genre.length < 20 ? (
        <ScrollView>
          <View style={styles.root2}>
            <View style={styles.root2}>
              <View style={styles.cardHeader}>
                <TextWrap style={styles.userName}>{user.kor_nm} 님</TextWrap>
                <TextWrap style={styles.welcome}>
                  을 위한 맞춤도서를 확인해보세요!
                </TextWrap>
              </View>
              <RadarCharts></RadarCharts>
            </View>
            <View style={styles.root2}>
              <View style={styles.cardHeader2}>
                
                <TouchableOpacity onPress={()=> {setSelect('genre')}} style={select === 'genre' ? styles.btn : styles.btn2}>
                  <Text style={select === 'genre' ? styles.buttonText : styles.buttonText2}>장르별</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {setSelect('rank')}} style={select === 'rank' ? styles.btn : styles.btn2}>
                  <Text style={select === 'rank' ? styles.buttonText : styles.buttonText2}>수준별</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {setSelect('topic')}} style={select === 'topic' ? styles.btn : styles.btn2}>
                  <Text style={select === 'topic' ? styles.buttonText : styles.buttonText2}>주제별</Text>
                </TouchableOpacity>
                      
              </View>
              <NoMybooks />
            </View>
          </View>
        </ScrollView>
      ) : genre.length === 20 && select === 'genre' ? (
        <FlatList
          data={listData}
          extraData={listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <MyBookCarousel {...item} />;
          }}
          ListHeaderComponent= {
          <View>
            <View style={styles.cardHeader}>
              <TextWrap style={styles.userName}>{user.kor_nm} 님</TextWrap>
              <TextWrap style={styles.welcome}>
                을 위한 맞춤도서를 확인해보세요!
              </TextWrap>
            </View>
            <RadarCharts></RadarCharts>
            <View style={styles.cardHeader2}>
              
              <TouchableOpacity onPress={()=> {setSelect('genre')}} style={select === 'genre' ? styles.btn : styles.btn2}>
                <Text style={select === 'genre' ? styles.buttonText : styles.buttonText2}>장르별</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> {setSelect('rank')}} style={select === 'rank' ? styles.btn : styles.btn2}>
                <Text style={select === 'rank' ? styles.buttonText : styles.buttonText2}>수준별</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> {setSelect('topic')}} style={select === 'topic' ? styles.btn : styles.btn2}>
                <Text style={select === 'topic' ? styles.buttonText : styles.buttonText2}>주제별</Text>
              </TouchableOpacity>
                    
            </View>
          </View>
          }
        />
      ) : genre.length === 20 && select === 'rank' ? (
           <FlatList
          data={listData}
          extraData={listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <MyBookCarousel {...item} />;
          }}
          ListHeaderComponent= {
            <View>
              <View style={styles.cardHeader}>
                <TextWrap style={styles.userName}>{user.kor_nm} 님</TextWrap>
                <TextWrap style={styles.welcome}>
                  을 위한 맞춤도서를 확인해보세요!
                </TextWrap>
              </View>
              <RadarCharts></RadarCharts>
              <View style={styles.cardHeader2}>
                
                <TouchableOpacity onPress={()=> {setSelect('genre')}} style={select === 'genre' ? styles.btn : styles.btn2}>
                  <Text style={select === 'genre' ? styles.buttonText : styles.buttonText2}>장르별</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {setSelect('rank')}} style={select === 'rank' ? styles.btn : styles.btn2}>
                  <Text style={select === 'rank' ? styles.buttonText : styles.buttonText2}>수준별</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {setSelect('topic')}} style={select === 'topic' ? styles.btn : styles.btn2}>
                  <Text style={select === 'topic' ? styles.buttonText : styles.buttonText2}>주제별</Text>
                </TouchableOpacity>
                      
              </View>
            </View>
            }
        />
      ) : ( 
         <FlatList
          data={listData}
          extraData={listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            return <MyBookCarousel {...item} />;
          }}
          ListHeaderComponent= {
            <View>
              <View style={styles.cardHeader}>
                <TextWrap style={styles.userName}>{user.kor_nm} 님</TextWrap>
                <TextWrap style={styles.welcome}>
                  을 위한 맞춤도서를 확인해보세요!
                </TextWrap>
              </View>
              <RadarCharts></RadarCharts>
              <View style={styles.cardHeader2}>
                
                <TouchableOpacity onPress={()=> {setSelect('genre')}} style={select === 'genre' ? styles.btn : styles.btn2}>
                  <Text style={select === 'genre' ? styles.buttonText : styles.buttonText2}>장르별</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {setSelect('rank')}} style={select === 'rank' ? styles.btn : styles.btn2}>
                  <Text style={select === 'rank' ? styles.buttonText : styles.buttonText2}>수준별</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {setSelect('topic')}} style={select === 'topic' ? styles.btn : styles.btn2}>
                  <Text style={select === 'topic' ? styles.buttonText : styles.buttonText2}>주제별</Text>
                </TouchableOpacity>
                      
              </View>
            </View>
            }
        />
      )
      
      
      }
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: screenWidth
  },
  root2: {
    flexGrow: 1,
    marginBottom : heightPercentage(30),
  },
  cardHeader: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 40,
    paddingLeft : widthPercentage(20),
  },
  cardHeader2: {
    alignSelf:'center',
    width:screenWidth * 0.7,
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 40,
    alignItems:'center',
    justifyContent:'space-between',
  },
  userName: {
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
    color: '#f3714f',
  },
  welcome: {
    fontSize: fontPercentage(15),
    fontWeight: 'bold',
  },
  btn: {
    borderRadius: 70,
    fontWeight: 'bold',
    color:'white',
    backgroundColor:'black',
  },
buttonText: {
  width:widthPercentage(50),
  height:heightPercentage(25),
  color: 'white',
  fontSize:fontPercentage(12),
  fontWeight:'bold',
  textAlign:'center',
  textAlignVertical:'center', 
},
btn2: {
    borderRadius: 70,
    fontWeight: 'bold',
    color:'black',
    backgroundColor:'white',
     borderColor:'black',
  borderWidth: 1,
  },
buttonText2: {
  width:widthPercentage(50),
  height:heightPercentage(25),
  color: 'black',
  fontSize:fontPercentage(12),
  fontWeight:'bold',
  textAlign:'center',
  textAlignVertical:'center', 
 
}
});