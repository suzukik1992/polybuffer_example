autowatch = 1;

var sampleName = [];
var sampleIndex = [];
var fileList = [];
var buffer = new PolyBuffer(jsarguments[1]);

function bang(){
    
    //make the path
    var mainPath = this.patcher.filepath;
    var mediaPath = mainPath.slice(0,mainPath.indexOf("/patchers")) + "/media";
	var polyBufferPath = mediaPath + "/";
    var folder = new Folder(mediaPath);
    
    //initialize
	buffer.clear();
    sampleName.length = 0;
    sampleIndex.length = 0;
	var doubleCheck = 0;
    
    //filter file-type
    folder.typelist = ["AIFF", "WAVE"];
    
    //check if index is numbers
    for(var i=0; i<folder.count; i++){
        folder.next();
        if(folder.filename.indexOf("_") != -1){
            var checkIndex = folder.filename.slice(0,folder.filename.indexOf("_"));
            if(isNaN(checkIndex) == true){
               log("filename error : index is not Number");
               return;
            }
            sampleIndex.push(checkIndex);
            sampleName.push(folder.filename);
        }
        else{
            log("filename error : no index file exist");
            return;
        }
    }
    
	//sort samplefile
	for(var i=0; i<sampleIndex.length; i++){
		fileList[i] = new setup(sampleIndex[i], sampleName[i]);
	}
	fileList.sort(function(a, b){
		if(a.index < b.index) return -1;
		if(a.index > b.index) return 1;
		doubleCheck = 1;
		return 0;
	});
	
	//double Check
	if(doubleCheck == 1){
		log("filename error : index is doubled");
		return;
	}
	
    //make buffers and fileindex list
	var fileIndexList = "";
	for(var i=0; i<sampleIndex.length; i++){
		eval("buffer.append(fileList[i].filename)");
		fileIndexList = fileIndexList + " " + fileList[i].index;
	}
	
	//set se number
	se_number = sampleIndex.length;

 	//output fileindex
	outlet(0, fileIndexList);

}

function setup(i, n){
	this.index = Number(i);
	this.filename = n;
}

function polybuffer_open(){
	buffer.open();
}

//for log function
function log(message) {
    for(var i=0, len=arguments.length; i<len; i++){
        var message = arguments[i];
        if(message && message.toString){
            var s = message.toString();
            if(s.indexOf("[object ") >= 0){
                s = JSON.stringify(message);
            }
            post(s);
        }
        else if(message===null){
            post("<null>");
        }
        
        else {
            post(message);
        }
    }
    post("\n");
}
