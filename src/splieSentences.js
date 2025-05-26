export function splitTextIntoSentences(text) {
  // 使用正则匹配句子结束符号：句号、问号、感叹号，考虑中英文
  const sentenceRegex = /[^.!?。！？\n]+[.!?。！？]?/g;
  const sentences = text.match(sentenceRegex);

  // 去除前后空格，过滤空字符串
  return sentences
    ? sentences.map((s) => s.trim()).filter((s) => s.length > 0)
    : [];
}
