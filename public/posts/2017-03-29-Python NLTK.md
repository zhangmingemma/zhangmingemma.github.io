<!-- ---
title: 英文文本预处理-Python NLTK
date: 2017-03-29
tags: Python
--- -->

　　文本预处理是要文本处理成计算机能识别的格式，是文本分类、文本可视化、文本分析等研究的重要步骤。具体流程包括文本分词、去除停用词、词干抽取(词形还原)、文本向量表征、特征选择等步骤，以消除脏数据对挖掘分析结果的影响。

　　本文仅针对英文文本，中文文本暂时还没有研究过。介绍的全部都是基于Python2.7，利用NLTK库进行文本分类的过程。

### 文本分词

文本分词即将文本拆解成词语单元，英文文本以英文单词空格连接成句，分词过程较为简单。以下介绍几种方法。

**正则表达式分词**

以空格进行分词
```
>>> import re
>>> text = 'I was just a kid, and loved it very much! What a fantastic song!'
>>> print re.split(r' ',text)

['I', 'was', 'just', 'a', 'kid,', 'and', 'loved', 'it', 'very', 'much!', 'What', 'a', 'fantastic', 'song!']
```

re匹配符号进行分词
```
>>> print re.split(r'\W+', text)

['I', 'was', 'just', 'a', 'kid', 'and', 'loved', 'it', 'very', 'much', 'What', 'a', 'fantastic', 'song', '']
```

```
>>> print re.findall(r'\w+|\S\w*', text)

['I', 'was', 'just', 'a', 'kid', ',', 'and', 'loved', 'it', 'very', 'much', '!', 'What', 'a', 'fantastic', 'song', '!']
```

```
>>> print re.findall(r"\w+(?:[-']\w+)*|'|[-.(]+|\S\w*", text)

['I', 'was', 'just', 'a', 'kid', ',', 'and', 'loved', 'it', 'very', 'much', '!', 'What', 'a', 'fantastic', 'song', '!']
```

NLTK正则表达式分词器
```
>>> import re
>>> import nltk
>>> text = 'I was just a kid, and loved it very much! What a fantastic song!'
>>> pattern = r"""(?x)                   # set flag to allow verbose regexps 
	              (?:[A-Z]\.)+           # abbreviations, e.g. U.S.A. 
	              |\d+(?:\.\d+)?%?       # numbers, incl. currency and percentages 
	              |\w+(?:[-']\w+)*       # words w/ optional internal hyphens/apostrophe 
	              |\.\.\.                # ellipsis 
	              |(?:[.,;"'?():-_`])    # special characters with meanings 
	            """ 
>>> print nltk.regexp_tokenize(text, pattern)

['I', 'was', 'just', 'a', 'kid', ',', 'and', 'loved', 'it', 'very', 'much', 'What', 'a', 'fantastic', 'song']
```

**最大匹配算法（MaxMatch）分词**

　　MaxMatch算法在中文自然语言处理中常常用来进行分词（或许从名字上你已经能想到它是基于贪婪策略设计的一种算法），算法从右侧开始逐渐减少字符串长度，以此求得可能匹配到nltk字库中词语的最大长度的字符串。这种方法其实更常用于中文文本分词，但是不排除某些英文文本并不以空格作为分隔符，特此介绍一下
```
>>> import nltk
>>> from nltk.corpus import words  
>>> wordlist = set(words.words())   
>>> def max_match(text):  
    pos2 = len(text)  
    result = ''  
    while len(text) > 0:         
        word = text[0:pos2]
        if word in wordlist:  
            result = result + text[0:pos2] + ' '  
            text = text[pos2:]  
            pos2 = len(text)  
        else:  
            pos2 = pos2-1                 
    return result[0:-1]  
>>> string = 'theyarebirds'  
>>> print(max_match(string))

they are bird s
```

### 停用词去除

简单易懂，匹配词库中的停用词，去除！以消除冠词、连词等一些无意义无作用的词增加数据占用空间，并避免其为挖掘计算带来的干扰。

**NLTK停用词库**
```
>>> import nltk
>>> from nltk.corpus import stopwords
>>> stopworddic = set(stopwords.words('english'))  
>>> text = ['I', 'was', 'just', 'a', 'kid',  'and', 'loved', 'it', 'very', 'much', 'What', 'a', 'fantastic', 'song']
>>> text = [i for i in text if i not in stopworddic ]
>>> print text
　　
['I', 'kid', 'loved', 'much', 'What', 'fantastic', 'song']
```

**自定义词库**

方法同上，自定义停用词，或者下载网络上的停用词库进行停用词去除

### 词干抽取

　　将文本列表中的词语抽取其词干，以统一特征表征形式，特征降维以减少计算量。NLTK中提供了三种最常用的词干提取器接口，即 Porter stemmer, Lancaster Stemmer 和 Snowball Stemmer。抽取词的词干或词根形式（不一定能够表达完整语义）
```
>>> from nltk.stem.porter import PorterStemmer  
>>> porter_stemmer = PorterStemmer()  

>>> from nltk.stem.lancaster import LancasterStemmer  
>>> lancaster_stemmer = LancasterStemmer()  

>>> from nltk.stem import SnowballStemmer  
>>> snowball_stemmer = SnowballStemmer(“english”)  

>>> porter_stemmer.stem(‘maximum’)  
u’maximum’  
>>> lancaster_stemmer.stem(‘maximum’)  
‘maxim’  
>>> snowball_stemmer.stem(‘maximum’)  
u’maximum’  

>>> porter_stemmer.stem(‘presumably’)  
u’presum’  
>>> snowball_stemmer.stem(‘presumably’)  
u’presum’  
>>> lancaster_stemmer.stem(‘presumably’)  
‘presum’  

>>> porter_stemmer.stem(‘multiply’)  
u’multipli’ 
>>> snowball_stemmer.stem(‘multiply’)  
u’multipli’  
>>> lancaster_stemmer.stem(‘multiply’)  
‘multiply’ 

>>> porter_stemmer.stem(‘provision’)  
u’provis’  
>>> snowball_stemmer.stem(‘provision’)  
u’provis’  
>>> lancaster_stemmer.stem(‘provision’)  
u’provid’  

>>> porter_stemmer.stem(‘owed’)  
u’owe’  
>>> snowball_stemmer.stem(‘owed’)  
u’owe’  
>>> lancaster_stemmer.stem(‘owed’)  
‘ow’   
```
各有优劣，看具体文本情况。对于分类、聚类这样对于特征词语的具体形态没有要求的情况下，进行词干抽取虽然抽取后的词干可能无实际意义但是却会大大减少计算时间，提高效率。

### 词形还原

　　词形还原Lemmatization是把一个任何形式的语言词汇还原为一般形式（能表达完整语义）。相对而言，词干提取是简单的轻量级的词形归并方式，最后获得的结果为词干，并不一定具有实际意义。词形还原处理相对复杂，获得结果为词的原形，能够承载一定意义，与词干提取相比，更具有研究和应用价值。
```
>>> from nltk.stem import WordNetLemmatizer  
>>> wordnet_lemmatizer = WordNetLemmatizer()  
>>> word = wordnet_lemmatizer.lemmatize('birds')  

bird
```
nltk的lemmatization算法很鸡肋，基本可以理解为只有复数还原为单数形式，当然feet这样的非常态复数形式也可以实现，但是你要想形容词变名词，就不太怎么好使了，比如我在实验中geology，geography，geographic，geographical这几个词就无法还原成统一体。

### 文本向量表征以及TF-IDF权重表示

这一部分是基于Python的[Gensim](http://radimrehurek.com/gensim/)库将文本特征抽取为词袋，并将词袋表征为id,以特征id以及文档频率表征成文本向量。[TF-IDF](http://baike.baidu.com/link?url=o8wTt7PnzFPnNWbP-sZ3Sn0kzpGVojCsbYQC3bx-86k5KQfVJo55Sxapb4l2ybnuozKf4KY2tSka5GLdrBooSa)权重是很可靠的权重表征方式，用以评估一字词对于一个文件集或一个语料库中的其中一份文件的重要程度。字词的重要性随着它在文件中出现的次数成正比增加，但同时会随着它在语料库中出现的频率成反比下降。TF-IDF加权的各种形式常被搜索引擎应用，作为文件与用户查询之间相关程度的度量或评级。
```
#coding:utf-8
from gensim import corpora, models, similarities

documents = ["Shipment of gold damaged in a fire","Delivery of silver arrived in a silver truck","Shipment of gold arrived in a truck"]

#分词#
texts = [[word for word in document.lower().split()] for document in documents]
print texts

#抽取词袋，将token映射为id
dictionary = corpora.Dictionary(texts)
print dictionary.token2id

#由文档向量以及频率构成文档向量
corpus = [dictionary.doc2bow(text) for text in texts]
print corpus

#计算tfidf权重,注意在gensim的tfidf算法中到文档频率的求解过程中对数之后+1了
tfidf = models.TfidfModel(corpus)
corpus_tfidf = tfidf[corpus]
for doc in corpus_tfidf:
	print doc
print tfidf.dfs
print tfidf.idfs
```
除此之外，最近导师推给我的一篇文章Word2vec也是文本向量表征的一种方式，考虑了上下文的语义联系，可以深入研究。

### 特征选择

　　根据研究的需求进行特征的选择已达到特征降维，减小噪音的影响。常见的是根据词频（TF）、倒文档频率（IDF）、TFIDF权重等设定阈值进行筛选，无非是在TF/IDF/TFIDF权重计算结果的基础上设定阈值进行筛检。除此之外互信息、信息增益、X平方统计也是常见的方法。除此之外，如果你的研究是在给定类别名称的前提下进行语义文本分类，那么判断特征词与分类之间的语义相似度，从而进行筛选也是一种可行的方法。这里介绍的便是基于WordNet进行语义相似度的介绍。

WordNet计算语义相似度常见的包括两种主要方法：
path_similarity(sense1,sense2) # 词在词典层次结构中的最短路径
wup_similarity(sense1, sense2) # Wu-Palmer 提出的最短路径

```
#coding:utf-8
import nltk
from nltk.corpus import wordnet as wn
from heapq import *  
from itertools import product

word1 = 'hen'
word2 = 'chicken'

sense1 = wn.synsets(word1)
sense2 = wn.synsets(word2)

sim_wup = max(word1.wup_similarity(word2) for (word1, word2) in product(sense1, sense2))
print sim_wup

sim_path = max(word1.path_similarity(word2) for (word1, word2) in product(sense1, sense2))
print sim_path
```
运行结果
```
0.962962962963
0.5
```
               

