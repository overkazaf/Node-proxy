var http=require('http');
var url=require('url');

//创建http服务器
http.createServer(function(req,res){
    //获得请求body
    var start_time=new Date;
    var body='';

    req.on('data',function(chunk){
        body+=chunk;
    });

    console.log(start_time);

    var options = {
        //hostname : '50.117.87.141',
        hostname : '119.75.217.109',
        port : 80,
        path : '/',
        method : 'GET'
    };
    var re = http.request(options, function (res) {
        console.log('STATUS:' + res.statusCode);
        console.log('Headers:' + JSON.stringify(res.headers));

        res.setEncoding('utf8');
        res.on('data', function (chunk){
            console.log(chunk);
        });
    });
    re.end();

    req.on('end',function(){
            //代理请求
            var request_url='http://50.117.87.141';
            var option=url.parse(request_url);
            //发送header
            req.headers.host=option.host;
            req.headers.fetchurl=req.url;//设置fetchUrl
            delete req.headers['accept-encoding'];
            option.method=req.method;
            option.headers=req.headers;
            http.request(option,function(result){
                //打出日志
                console.log('\033[90m'+req.url+'\t\033[33m'+result.statusCode+'\t\033[36m'+(new Date - start_time)+'ms \033[0m');
                //设置header
                for(var key in result.headers){
                    res.setHeader(key,result.headers[key]);
                }
                result.on('data',function(chunk){
                    res.write(chunk);
                });
                result.on('end',function(){
                    res.end();
                });
         }).on('error',function(error){
                res.end('remote http.request error'+error)}).end(body);

    });
}).listen(9527);

console.log('local proxy is listening at port 9527');