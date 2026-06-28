// Client-side Database Emulator for Online Examination System using localStorage
(function (global) {

  // Simple MD5 Hashing function in JavaScript
  function md5(string) {
    function RotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    function GG(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    function HH(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    function II(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };
    function WordToHex(lValue) {
      var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    };
    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
      AA = a; BB = b; CC = c; DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A); c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF); c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193); c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340); c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6); c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8); c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681); c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9); c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA); c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5); c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97); c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92); c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0); c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = AddUnsigned(a, AA); b = AddUnsigned(b, BB); c = AddUnsigned(c, CC); d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
  }

  // Database Seed Data
  var defaultAdmins = [
    { email: "vijaymahes9080@gmail.com", password: "123456" },
    { email: "admin@admin.com", password: "admin" }
  ];

  var defaultUsers = [
    { name: "Avantika", gender: "F", college: "KNIT sultanpur", email: "avantika420@gmail.com", mob: 7785068889, password: "e10adc3949ba59abbe56e057f20f883e" },
    { name: "Mark Zukarburg", gender: "M", college: "Stanford", email: "ceo@facebook.com", mob: 987654321, password: "e10adc3949ba59abbe56e057f20f883e" },
    { name: "Komal", gender: "F", college: "KNIT sultanpur", email: "komalpd2011@gmail.com", mob: 7785068889, password: "e10adc3949ba59abbe56e057f20f883e" },
    { name: "Tom Cruze", gender: "M", college: "Hollywood", email: "mi5@hollywood.com", mob: 7785068889, password: "e10adc3949ba59abbe56e057f20f883e" },
    { name: "Netcamp", gender: "M", college: "KNIT sultanpur", email: "netcamp@gmail.com", mob: 987654321, password: "e10adc3949ba59abbe56e057f20f883e" },
    { name: "Nikunj", gender: "M", college: "XYZ", email: "nik1@gmail.com", mob: 987, password: "202cb962ac59075b964b07152d234b70" },
    { name: "Vijay", gender: "M", college: "KNIT sultanpur", email: "vijaymahes9080@gmail.com", mob: 7785068889, password: "e10adc3949ba59abbe56e057f20f883e" },
    { name: "User", gender: "M", college: "cimt", email: "user@user.com", mob: 11, password: "e10adc3949ba59abbe56e057f20f883e" },
    { name: "Vikash", gender: "M", college: "KNIT sultanpur@gmail.com", email: "vikash@gmail.com", mob: 7785068889, password: "e10adc3949ba59abbe56e057f20f883e" }
  ];

  var defaultQuizzes = [
    { eid: "558920ff906b8", title: "Linux : File Managment", sahi: 2, wrong: 1, total: 2, time: 5, intro: "", tag: "linux", date: "2015-06-23 09:03:59" },
    { eid: "558921841f1ec", title: "Php Coding", sahi: 2, wrong: 1, total: 2, time: 5, intro: "", tag: "PHP", date: "2015-06-23 09:06:12" },
    { eid: "5589222f16b93", title: "C++ Coding", sahi: 2, wrong: 1, total: 2, time: 5, intro: "", tag: "c++", date: "2015-06-23 09:09:03" },
    { eid: "558922ec03021", title: "Networking", sahi: 2, wrong: 1, total: 2, time: 5, intro: "", tag: "networking", date: "2015-06-23 09:12:12" },
    { eid: "55897338a6659", title: "Linux:startup", sahi: 2, wrong: 1, total: 5, time: 10, intro: "", tag: "linux", date: "2015-06-23 14:54:48" },
    { eid: "5589741f9ed52", title: "Linux :vi Editor", sahi: 2, wrong: 1, total: 5, time: 10, intro: "", tag: "linux", date: "2015-06-23 14:58:39" }
  ];

  var defaultQuestions = [
    // Linux : File Managment
    { eid: "558920ff906b8", qid: "55892169bf6a7", qns: "what is command for changing user information??", choice: 4, sn: 1 },
    { eid: "558920ff906b8", qid: "5589216a3646e", qns: "what is permission for view only for other??", choice: 4, sn: 2 },
    // Php Coding
    { eid: "558921841f1ec", qid: "558922117fcef", qns: "what is command for print in php??", choice: 4, sn: 1 },
    { eid: "558921841f1ec", qid: "55892211e44d5", qns: "which is a variable of php??", choice: 4, sn: 2 },
    // C++ Coding
    { eid: "5589222f16b93", qid: "558922894c453", qns: "what is correct statement in c++??", choice: 4, sn: 1 },
    { eid: "5589222f16b93", qid: "558922899ccaa", qns: "which command is use for print the output in c++?", choice: 4, sn: 2 },
    // Networking
    { eid: "558922ec03021", qid: "558923538f48d", qns: "what is correct mask for A class IP???", choice: 4, sn: 1 },
    { eid: "558922ec03021", qid: "55892353f05c4", qns: "which is not a private IP??", choice: 4, sn: 2 },
    // Linux:startup
    { eid: "55897338a6659", qid: "558973f4389ac", qns: "On Linux, initrd is a file", choice: 4, sn: 1 },
    { eid: "55897338a6659", qid: "558973f4c46f2", qns: "Which is loaded into memory when system is booted?", choice: 4, sn: 2 },
    { eid: "55897338a6659", qid: "558973f51600d", qns: " The process of starting up a computer is known as", choice: 4, sn: 3 },
    { eid: "55897338a6659", qid: "558973f55d269", qns: " Bootstrapping is also known as", choice: 4, sn: 4 },
    { eid: "55897338a6659", qid: "558973f5abb1a", qns: "The shell used for Single user mode shell is:", choice: 4, sn: 5 },
    // Linux :vi Editor
    { eid: "5589741f9ed52", qid: "5589751a63091", qns: " Which command is used to close the vi editor?", choice: 4, sn: 1 },
    { eid: "5589741f9ed52", qid: "5589751ad32b8", qns: " In vi editor, the key combination CTRL+f", choice: 4, sn: 2 },
    { eid: "5589741f9ed52", qid: "5589751b304ef", qns: " Which vi editor command copies the current line of the file?", choice: 4, sn: 3 },
    { eid: "5589741f9ed52", qid: "5589751b749c9", qns: " Which command is used to delete the character before the cursor location in vi editor?", choice: 4, sn: 4 },
    { eid: "5589741f9ed52", qid: "5589751bd02ec", qns: " Which one of the following statement is true?", choice: 4, sn: 5 }
  ];

  var defaultOptions = [
    // Linux : File Managment Q1
    { qid: "55892169bf6a7", option: "usermod", optionid: "55892169d2efc" },
    { qid: "55892169bf6a7", option: "useradd", optionid: "55892169d2f05" },
    { qid: "55892169bf6a7", option: "useralter", optionid: "55892169d2f09" },
    { qid: "55892169bf6a7", option: "groupmod", optionid: "55892169d2f0c" },
    // Linux : File Managment Q2
    { qid: "5589216a3646e", option: "751", optionid: "5589216a48713" },
    { qid: "5589216a3646e", option: "752", optionid: "5589216a4871a" },
    { qid: "5589216a3646e", option: "754", optionid: "5589216a4871f" },
    { qid: "5589216a3646e", option: "755", optionid: "5589216a48722" },
    // PHP Coding Q1
    { qid: "558922117fcef", option: "echo", optionid: "5589221195248" },
    { qid: "558922117fcef", option: "print", optionid: "558922119525a" },
    { qid: "558922117fcef", option: "printf", optionid: "5589221195265" },
    { qid: "558922117fcef", option: "cout", optionid: "5589221195270" },
    // PHP Coding Q2
    { qid: "55892211e44d5", option: "int a", optionid: "55892211f1f97" },
    { qid: "55892211e44d5", option: "$a", optionid: "55892211f1fa7" },
    { qid: "55892211e44d5", option: "long int a", optionid: "55892211f1fb4" },
    { qid: "55892211e44d5", option: "int a$", optionid: "55892211f1fbd" },
    // C++ Coding Q1
    { qid: "558922894c453", option: "cin>>a;", optionid: "558922895ea0a" },
    { qid: "558922894c453", option: "cin<<a;", optionid: "558922895ea26" },
    { qid: "558922894c453", option: "cout>>a;", optionid: "558922895ea34" },
    { qid: "558922894c453", option: "cout<a;", optionid: "558922895ea41" },
    // C++ Coding Q2
    { qid: "558922899ccaa", option: "cout", optionid: "55892289aa7cf" },
    { qid: "558922899ccaa", option: "cin", optionid: "55892289aa7df" },
    { qid: "558922899ccaa", option: "print", optionid: "55892289aa7eb" },
    { qid: "558922899ccaa", option: "printf", optionid: "55892289aa7f5" },
    // Networking Q1
    { qid: "558923538f48d", option: "255.0.0.0", optionid: "558923539a46c" },
    { qid: "558923538f48d", option: "255.255.255.0", optionid: "558923539a480" },
    { qid: "558923538f48d", option: "255.255.0.0", optionid: "558923539a48b" },
    { qid: "558923538f48d", option: "none of these", optionid: "558923539a495" },
    // Networking Q2
    { qid: "55892353f05c4", option: "192.168.1.100", optionid: "5589235405192" },
    { qid: "55892353f05c4", option: "172.168.16.2", optionid: "55892354051a3" },
    { qid: "55892353f05c4", option: "10.0.0.0.1", optionid: "55892354051b4" },
    { qid: "55892353f05c4", option: "11.11.11.11", optionid: "55892354051be" },
    // Linux:startup Q1
    { qid: "558973f4389ac", option: "containing root file-system required during bootup", optionid: "558973f462e44" },
    { qid: "558973f4389ac", option: " Contains only scripts to be executed during bootup", optionid: "558973f462e56" },
    { qid: "558973f4389ac", option: " Contains root-file system and drivers required to be preloaded during bootup", optionid: "558973f462e61" },
    { qid: "558973f4389ac", option: "None of the above", optionid: "558973f462e6b" },
    // Linux:startup Q2
    { qid: "558973f4c46f2", option: "Kernel", optionid: "558973f4d4abe" },
    { qid: "558973f4c46f2", option: "Shell", optionid: "558973f4d4acf" },
    { qid: "558973f4c46f2", option: "Commands", optionid: "558973f4d4ad9" },
    { qid: "558973f4c46f2", option: "Script", optionid: "558973f4d4ae3" },
    // Linux:startup Q3
    { qid: "558973f51600d", option: "Boot Loading", optionid: "558973f526f9d" },
    { qid: "558973f51600d", option: " Boot Record", optionid: "558973f526fb9" },
    { qid: "558973f51600d", option: " Boot Strapping", optionid: "558973f526fc5" },
    { qid: "558973f51600d", option: " Booting", optionid: "558973f526fce" },
    // Linux:startup Q4
    { qid: "558973f55d269", option: " Quick boot", optionid: "558973f57aef1" },
    { qid: "558973f55d269", option: "Cold boot", optionid: "558973f57af07" },
    { qid: "558973f55d269", option: " Hot boot", optionid: "558973f57af17" },
    { qid: "558973f55d269", option: " Fast boot", optionid: "558973f57af27" },
    // Linux:startup Q5
    { qid: "558973f5abb1a", option: "bash", optionid: "558973f5e7623" },
    { qid: "558973f5abb1a", option: " Csh", optionid: "558973f5e7636" },
    { qid: "558973f5abb1a", option: " ksh", optionid: "558973f5e7640" },
    { qid: "558973f5abb1a", option: " sh", optionid: "558973f5e764a" },
    // Linux :vi Editor Q1
    { qid: "5589751a63091", option: "q", optionid: "5589751a81bd6" },
    { qid: "5589751a63091", option: "wq", optionid: "5589751a81be8" },
    { qid: "5589751a63091", option: " both (a) and (b)", optionid: "5589751a81bf4" },
    { qid: "5589751a63091", option: " none of the mentioned", optionid: "5589751a81bfd" },
    // Linux :vi Editor Q2
    { qid: "5589751ad32b8", option: " moves screen down one page", optionid: "5589751adbdbd" },
    { qid: "5589751ad32b8", option: "moves screen up one page", optionid: "5589751adbdce" },
    { qid: "5589751ad32b8", option: "moves screen up one line", optionid: "5589751adbdd8" },
    { qid: "5589751ad32b8", option: " moves screen down one line", optionid: "5589751adbde2" },
    // Linux :vi Editor Q3
    { qid: "5589751b304ef", option: " yy", optionid: "5589751b3b04d" },
    { qid: "5589751b304ef", option: "yw", optionid: "5589751b3b05e" },
    { qid: "5589751b304ef", option: "yc", optionid: "5589751b3b069" },
    { qid: "5589751b304ef", option: " none of the mentioned", optionid: "5589751b3b073" },
    // Linux :vi Editor Q4
    { qid: "5589751b749c9", option: "X", optionid: "5589751b9a98c" },
    { qid: "5589751b749c9", option: "x", optionid: "5589751b9a9a5" },
    { qid: "5589751b749c9", option: "D", optionid: "5589751b9a9b7" },
    { qid: "5589751b749c9", option: "d", optionid: "5589751b9a9c9" },
    // Linux :vi Editor Q5
    { qid: "5589751bd02ec", option: "autoindentation is not possible in vi editor", optionid: "5589751bdadaa" },
    { qid: "5589751bd02ec", option: "autoindentation is possible with set ai", optionid: "5589751bdadab" },
    { qid: "5589751bd02ec", option: "autoindentation is default active", optionid: "5589751bdadac" },
    { qid: "5589751bd02ec", option: "none of the mentioned", optionid: "5589751bdadad" }
  ];

  var defaultAnswers = [
    { qid: "55892169bf6a7", ansid: "55892169d2efc" },
    { qid: "5589216a3646e", ansid: "5589216a48722" },
    { qid: "558922117fcef", ansid: "5589221195248" },
    { qid: "55892211e44d5", ansid: "55892211f1fa7" },
    { qid: "558922894c453", ansid: "558922895ea0a" },
    { qid: "558922899ccaa", ansid: "55892289aa7cf" },
    { qid: "558923538f48d", ansid: "558923539a46c" },
    { qid: "55892353f05c4", ansid: "55892354051be" },
    { qid: "558973f4389ac", ansid: "558973f462e61" },
    { qid: "558973f4c46f2", ansid: "558973f4d4abe" },
    { qid: "558973f51600d", ansid: "558973f526fc5" },
    { qid: "558973f55d269", ansid: "558973f57af07" },
    { qid: "558973f5abb1a", ansid: "558973f5e764a" },
    { qid: "5589751a63091", ansid: "5589751a81bf4" },
    { qid: "5589751ad32b8", ansid: "5589751adbdbd" },
    { qid: "5589751b304ef", ansid: "5589751b3b04d" },
    { qid: "5589751b749c9", ansid: "5589751b9a98c" },
    { qid: "5589751bd02ec", ansid: "5589751bdadaa" }
  ];

  var defaultRank = [
    { email: "vijaymahes9080@gmail.com", score: 9, time: "2015-06-24 03:22:38" },
    { email: "avantika420@gmail.com", score: 8, time: "2015-06-23 14:49:39" },
    { email: "mi5@hollywood.com", score: 4, time: "2015-06-23 15:12:56" },
    { email: "nik1@gmail.com", score: 1, time: "2015-06-23 16:11:50" }
  ];

  var defaultHistory = [
    { email: "vijaymahes9080@gmail.com", eid: "558921841f1ec", score: 4, level: 2, sahi: 2, wrong: 0, date: "2015-06-23 09:31:26" },
    { email: "vijaymahes9080@gmail.com", eid: "558920ff906b8", score: 4, level: 2, sahi: 2, wrong: 0, date: "2015-06-23 13:32:09" },
    { email: "avantika420@gmail.com", eid: "558921841f1ec", score: 4, level: 2, sahi: 2, wrong: 0, date: "2015-06-23 14:33:04" },
    { email: "avantika420@gmail.com", eid: "5589222f16b93", score: 4, level: 2, sahi: 2, wrong: 0, date: "2015-06-23 14:49:39" },
    { email: "vijaymahes9080@gmail.com", eid: "5589741f9ed52", score: 4, level: 5, sahi: 3, wrong: 2, date: "2015-06-23 15:07:16" },
    { email: "mi5@hollywood.com", eid: "5589222f16b93", score: 4, level: 2, sahi: 2, wrong: 0, date: "2015-06-23 15:12:56" },
    { email: "nik1@gmail.com", eid: "558921841f1ec", score: 1, level: 2, sahi: 1, wrong: 1, date: "2015-06-23 16:11:50" },
    { email: "vijaymahes9080@gmail.com", eid: "5589222f16b93", score: 1, level: 2, sahi: 1, wrong: 1, date: "2015-06-24 03:22:38" }
  ];

  var defaultFeedback = [
    { id: "55846be776610", name: "testing", email: "vijaymahes9080@gmail.com", subject: "testing", feedback: "testing stART", date: "2015-06-19", time: "09:22:15pm" },
    { id: "5584ddd0da0ab", name: "netcamp", email: "vijaymahes9080@gmail.com", subject: "feedback", feedback: ";mLBLB", date: "2015-06-20", time: "05:28:16am" },
    { id: "558510a8a1234", name: "sunnygkp10", email: "vijaymahes9080@gmail.com", subject: "dl;dsnklfn", feedback: "fmdsfld fdj", date: "2015-06-20", time: "09:05:12am" },
    { id: "5585509097ae2", name: "sunny", email: "vijaymahes9080@gmail.com", subject: "kcsncsk", feedback: "l.mdsavn", date: "2015-06-20", time: "01:37:52pm" }
  ];

  // Helper to load/save tables from/to localStorage
  function loadTable(key, defaultData) {
    var raw = localStorage.getItem("db_" + key);
    if (!raw) {
      localStorage.setItem("db_" + key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  }

  function saveTable(key, data) {
    localStorage.setItem("db_" + key, JSON.stringify(data));
  }

  // Load Database Tables
  var admins = loadTable("admins", defaultAdmins);
  var users = loadTable("users", defaultUsers);
  var quizzes = loadTable("quizzes", defaultQuizzes);
  var questions = loadTable("questions", defaultQuestions);
  var options = loadTable("options", defaultOptions);
  var answers = loadTable("answers", defaultAnswers);
  var rank = loadTable("rank", defaultRank);
  var history = loadTable("history", defaultHistory);
  var feedback = loadTable("feedback", defaultFeedback);

  // Database API
  var db = {
    // Admin functions
    getAdmin: function (email, password) {
      return admins.find(function (a) { return a.email === email && a.password === password; });
    },
    // User functions
    getUser: function (email, password) {
      var hashedPw = md5(password);
      return users.find(function (u) { return u.email === email && (u.password === password || u.password === hashedPw); });
    },
    getUserByEmail: function (email) {
      return users.find(function (u) { return u.email === email; });
    },
    addUser: function (name, gender, college, email, mob, password) {
      if (db.getUserByEmail(email)) {
        return false;
      }
      var newUser = {
        name: name,
        gender: gender,
        college: college,
        email: email,
        mob: mob,
        password: md5(password)
      };
      users.push(newUser);
      saveTable("users", users);
      return true;
    },
    getUsers: function () {
      return users;
    },
    deleteUser: function (email) {
      users = users.filter(function (u) { return u.email !== email; });
      saveTable("users", users);
      // Clean ranks & history
      rank = rank.filter(function (r) { return r.email !== email; });
      saveTable("rank", rank);
      history = history.filter(function (h) { return h.email !== email; });
      saveTable("history", history);
      return true;
    },

    // Quiz functions
    getQuizzes: function () {
      return quizzes.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    },
    getQuiz: function (eid) {
      return quizzes.find(function (q) { return q.eid === eid; });
    },
    addQuiz: function (title, sahi, wrong, total, time, desc, tag) {
      var eid = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      var newQuiz = {
        eid: eid,
        title: title,
        sahi: parseInt(sahi),
        wrong: parseInt(wrong),
        total: parseInt(total),
        time: parseInt(time),
        intro: desc,
        tag: tag,
        date: new Date().toISOString()
      };
      quizzes.push(newQuiz);
      saveTable("quizzes", quizzes);
      return eid;
    },
    removeQuiz: function (eid) {
      quizzes = quizzes.filter(function (q) { return q.eid !== eid; });
      saveTable("quizzes", quizzes);
      // Remove questions, options, answers, history
      var qidsToRemove = questions.filter(function (q) { return q.eid === eid; }).map(function (q) { return q.qid; });
      questions = questions.filter(function (q) { return q.eid !== eid; });
      saveTable("questions", questions);

      options = options.filter(function (o) { return qidsToRemove.indexOf(o.qid) === -1; });
      saveTable("options", options);

      answers = answers.filter(function (a) { return qidsToRemove.indexOf(a.qid) === -1; });
      saveTable("answers", answers);

      history = history.filter(function (h) { return h.eid !== eid; });
      saveTable("history", history);
      return true;
    },

    // Question functions
    getQuestions: function (eid) {
      return questions.filter(function (q) { return q.eid === eid; }).sort(function (a, b) { return a.sn - b.sn; });
    },
    addQuestion: function (eid, qid, qns, choice, sn) {
      var newQ = {
        eid: eid,
        qid: qid,
        qns: qns,
        choice: choice,
        sn: sn
      };
      questions.push(newQ);
      saveTable("questions", questions);
    },

    // Options functions
    getOptions: function (qid) {
      return options.filter(function (o) { return o.qid === qid; });
    },
    addOption: function (qid, option, optionid) {
      options.push({ qid: qid, option: option, optionid: optionid });
      saveTable("options", options);
    },

    // Answers functions
    getAnswer: function (qid) {
      var ans = answers.find(function (a) { return a.qid === qid; });
      return ans ? ans.ansid : null;
    },
    setAnswer: function (qid, ansid) {
      answers = answers.filter(function (a) { return a.qid !== qid; });
      answers.push({ qid: qid, ansid: ansid });
      saveTable("answers", answers);
    },

    // History functions
    getHistory: function (email) {
      return history.filter(function (h) { return h.email === email; });
    },
    getQuizHistory: function (email, eid) {
      return history.find(function (h) { return h.email === email && h.eid === eid; });
    },
    saveQuizAttempt: function (email, eid, score, level, sahi, wrong) {
      history = history.filter(function (h) { return !(h.email === email && h.eid === eid); });
      history.push({
        email: email,
        eid: eid,
        score: score,
        level: level,
        sahi: sahi,
        wrong: wrong,
        date: new Date().toISOString()
      });
      saveTable("history", history);

      // Update Rankings
      var userScores = history.filter(function (h) { return h.email === email; });
      var totalScore = userScores.reduce(function (sum, h) { return sum + h.score; }, 0);
      
      rank = rank.filter(function (r) { return r.email !== email; });
      rank.push({
        email: email,
        score: totalScore,
        time: new Date().toISOString()
      });
      saveTable("rank", rank);
    },

    // Rankings functions
    getRanks: function () {
      return rank.sort(function (a, b) {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(a.time) - new Date(b.time); // earliest score wins tie
      });
    },

    // Feedback functions
    getFeedbacks: function () {
      return feedback.sort(function (a, b) { return new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time); });
    },
    addFeedback: function (name, email, subject, feedbackStr) {
      var id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      var today = new Date();
      var dateStr = today.toISOString().split('T')[0];
      var timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
      feedback.push({
        id: id,
        name: name,
        email: email,
        subject: subject,
        feedback: feedbackStr,
        date: dateStr,
        time: timeStr
      });
      saveTable("feedback", feedback);
      return true;
    },
    deleteFeedback: function (id) {
      feedback = feedback.filter(function (f) { return f.id !== id; });
      saveTable("feedback", feedback);
      return true;
    }
  };

  // Session API (managed in sessionStorage)
  var session = {
    getUser: function () {
      var raw = sessionStorage.getItem("session_user");
      return raw ? JSON.parse(raw) : null;
    },
    getAdmin: function () {
      var raw = sessionStorage.getItem("session_admin");
      return raw ? JSON.parse(raw) : null;
    },
    setUser: function (user) {
      sessionStorage.setItem("session_user", JSON.stringify(user));
    },
    setAdmin: function (admin) {
      sessionStorage.setItem("session_admin", JSON.stringify(admin));
    },
    logout: function () {
      sessionStorage.removeItem("session_user");
      sessionStorage.removeItem("session_admin");
    }
  };

  global.db = db;
  global.session = session;

})(window);
