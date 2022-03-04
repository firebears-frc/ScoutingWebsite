from ast import arg
import os
import data
from datetime import date,datetime

v = "v0.9"

def tprint(txt):
	print("[" + datetime.now().strftime("%H:%M:%S") + "] " + txt)

def ver():
    tprint("Scouting Website Version -" + v)

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def printData():
    finalText = ""
    tprint("EEEEEEEEEEEEEEE")
    with data.ScoutingData(data.fname(2846)) as reader:
        edata = reader.get_data("%")
        tprint(str(edata))
        lastTeam = ""
        for d in edata:
            if(lastTeam != edata["team"]):
                finalText += "\n"
            
            currentData = edata[d]
            tprint(str(currentData))
            finalText += " "*(6-len(currentData)) + currentData[:6]      

    tprint(finalText)

def printHelp():
    ## print help console
    with open("help.txt", "r") as fp:
        helpstr = fp.read()
        print(helpstr)