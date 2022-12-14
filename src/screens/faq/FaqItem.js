import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import images from '../../libs/images';
import { fontPercentage, heightPercentage, screenWidth } from '../../services/util';
import HTMLView from 'react-native-htmlview';
import RenderHtml from 'react-native-render-html';
import table from '@native-html/table-plugin';
import WebView from 'react-native-webview';

const renderers = {
  table
};

const htmlConfig = {
  renderers,
  WebView,
  renderersProps: {
    table: {
      animationType: 'animated',
      tableStyleSpecs: {
        outerBorderWidthPx: 1,
        rowsBorderWidthPx: 1,
        columnsBorderWidthPx: 1,
        trOddBackground: 'white',
        thBorderColor: 'black',
        tdBorderColor: 'black',
        outerBorderColor: 'black',
      },
    },
    img: {
      enableExperimentalPercentWidth: true,
    }
  },
  tagsStyles: {
    table: {
      flex: 1,
      alignSelf: 'center',
      minWidth: screenWidth * 0.92,
      maxWidth: screenWidth * 0.92,
      paddingHorizontal: 2,
    },
    img: {
      minWidth: screenWidth * 0.85,
      maxWidth: screenWidth * 0.85,
      alignSelf: 'center',
    },
    p: {
      fontSize: fontPercentage(14)
    },
    span: {
      fontSize: fontPercentage(14)
    },
    strong: {
      fontSize: fontPercentage(14)
    },
  },
  defaultWebViewProps: {},
  computeEmbeddedMaxWidth: (contentWidth, tagName) => {
    if (tagName === 'table') {
      return Math.min(contentWidth, 500);
    }
    return contentWidth;
  }
};

export default function FaqItem({
  registerDt,
  question,
  answer,
  category,
  categoryType,
  isFocused,
}) {
  const [open, setOpen] = useState(false);
  const regex = /<br>|\n|\r\s*\\?>/gm;
  const source = {
    html: answer.replace(/font/gi, 'span').trim().replace(regex, '')
  };

  // const renderNode = (node, index, parent, siblings, defaultRenderer) => {
  //   if (node.name == 'img') {
  //     const a = node.attribs;
  //     return (
  //       <View key={index.toString()}>
  //         <Image style={{
  //           width: screenWidth * 0.84, height: heightPercentage(800), resizeMode
  //             : 'stretch'
  //         }} source={{ uri: a.src }} />
  //       </View>
  //     );
  //   }

  //   if (node.name == 'p') {
  //     return (
  //       <Text key={index.toString()} style={styles.pFont}>
  //         {defaultRenderer(node.children, parent)}
  //       </Text>
  //     )
  //   }
  // };
  //alert(JSON.stringify(category));

  useEffect(() => {
    setOpen(false);
  }, [categoryType, isFocused]);
  return (
    <View>
      {categoryType === 'service'
        ? category === '?????????' && (
          <TouchableOpacity
            style={[styles.main, open && styles.mainOpend]}
            onPress={() => {
              setOpen(!open);
            }}>
            <View style={[styles.mainContent, open && { marginTop: 6 }]}>
              <TextWrap
                font={fonts.kopubWorldDotumProMedium}
                style={styles.title}>
                {question}
              </TextWrap>
            </View>
            <Image
              source={open ? images.angleUp : images.angleDown}
              style={styles.up}
            />
          </TouchableOpacity>
        )
        : categoryType === 'feed'
          ? category === '?????????' && (
            <TouchableOpacity
              style={[styles.main, open && styles.mainOpend]}
              onPress={() => {
                setOpen(!open);
              }}>
              <View style={[styles.mainContent, open && { marginTop: 6 }]}>
                <TextWrap
                  font={fonts.kopubWorldDotumProMedium}
                  style={styles.title}>
                  {question}
                </TextWrap>
              </View>
              <Image
                source={open ? images.angleUp : images.angleDown}
                style={styles.up}
              />
            </TouchableOpacity>
          )
          : categoryType === 'read'
            ? category === '????????????' && (
              <TouchableOpacity
                style={[styles.main, open && styles.mainOpend]}
                onPress={() => {
                  setOpen(!open);
                }}>
                <View style={[styles.mainContent, open && { marginTop: 6 }]}>
                  <TextWrap
                    font={fonts.kopubWorldDotumProMedium}
                    style={styles.title}>
                    {question}
                  </TextWrap>
                </View>
                <Image
                  source={open ? images.angleUp : images.angleDown}
                  style={styles.up}
                />
              </TouchableOpacity>
            )
            : categoryType === 'mem'
              ? category === '??????' && (
                <TouchableOpacity
                  style={[styles.main, open && styles.mainOpend]}
                  onPress={() => {
                    setOpen(!open);
                  }}>
                  <View style={[styles.mainContent, open && { marginTop: 6 }]}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.title}>
                      {question}
                    </TextWrap>
                  </View>
                  <Image
                    source={open ? images.angleUp : images.angleDown}
                    style={styles.up}
                  />
                </TouchableOpacity>
              )
              : category === '?????????' && (
                <TouchableOpacity
                  style={[styles.main, open && styles.mainOpend]}
                  onPress={() => {
                    setOpen(!open);
                  }}>
                  <View style={[styles.mainContent, open && { marginTop: 6 }]}>
                    <TextWrap
                      font={fonts.kopubWorldDotumProMedium}
                      style={styles.title}>
                      {question}
                    </TextWrap>
                  </View>
                  <Image
                    source={open ? images.angleUp : images.angleDown}
                    style={styles.up}
                  />
                </TouchableOpacity>
              )}
      {open && (
        <View style={styles.desc}>
          <View style={styles.descText}>
            {/* <HTMLView value={answer.trim().replace(regex, '')} renderNode={renderNode} /> */}
            <RenderHtml
              contentWidth={screenWidth * 0.92}
              source={source}
              {...htmlConfig}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  descDate: {
    fontSize: fontPercentage(13),
    lineHeight: fontPercentage(15),
    color: '#777777',
    marginTop: 12,
  },


  desc: {
    padding: 16,
    paddingBottom: 0,
  },
  descText: {
    color: '#555555',
    fontSize: fontPercentage(14),
    fontFamily: fonts.kopubWorldDotumProLight,
    lineHeight: fontPercentage(20),
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: heightPercentage(20),
  },


  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 1,
  },
  mainContent: {
    flex: 1,
    height: heightPercentage(50),
    ...Platform.select({
      ios: {
        top: heightPercentage(20),
      },
    }),
  },
  mainOpend: { paddingVertical: 10 },
  date: {
    fontSize: fontPercentage(12),
    lineHeight: fontPercentage(15),
    color: '#999999',
    marginTop: 10,
  },
  title: {
    textAlignVertical: 'center',
    color: colors.black,
    fontSize: fontPercentage(15),
    lineHeight: fontPercentage(21),
    height: '100%'
  },
  up: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  pFont: {
    marginBottom: 0,
  }
});
