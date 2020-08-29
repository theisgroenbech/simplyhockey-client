import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Button, CircularProgress,
  createMuiTheme,
  InputAdornment,
  MuiThemeProvider,
  Paper,
  Snackbar,
  Typography
} from '@material-ui/core';
import { getOverviews, setStreaming } from './API';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import logo from './app_icon-web.png';
import { saveDummies, saveFiles } from './utils/gameManager';
import moment from 'moment';
const { dialog } = require('electron').remote;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#125688'
    }
  }
});

const styles = ({
  container: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#125688',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  paper: {
    width: '70%',
    height: '80%',
    display: 'flex',
    maxWidth: 1000,
    alignItems: 'center',
    flexDirection: 'column',
    padding: 30
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%'
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  textField: { width: '100%', paddingBottom: 10 },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});
const desktopDir = require('path').join(require('os').homedir(), 'Desktop') + '/Simply Hockey';

const today = moment().format("YYYY-MM-DD")

export default function Screen() {
  const [games, setGames] = React.useState([]);
  const [showSettings, setShowSettings] = React.useState(false);
  const [directory, setDirectory] = React.useState(desktopDir);
  const [timeToClear, setTimeToClear] = React.useState('10');
  const [streamingLink, setStreamingLink] = React.useState('');
  const [showUploadSuccess, setUploadSuccess] = React.useState(false);
  const [hasStarted, setStarted] = React.useState(false);

  const [value, setValue] = React.useState<object | null>();
  const [inputValue, setInputValue] = React.useState('');


  useEffect(() => {
    getOverviews((o: any) => {
      console.log(o);
      setGames(o);
    }, today);
  }, []);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setUploadSuccess(false);
  };

  const startService = async () => {
    if (value) {
      setStarted(true);
      await saveFiles(directory, parseInt(timeToClear), (value as any).ID);
    }
  };

  const renderHeader = () => {
    return <div style={styles.title}>
      <img width={120} style={{ paddingBottom: 20 }} src={logo}/>
      <Typography variant="h3" gutterBottom>Simply Hockey</Typography>
    </div>;
  };

  const renderButtons = () => {
    return <div style={styles.buttons}>
      <Button style={{ marginBottom: 10 }} onClick={() => setShowSettings(!showSettings)}>Indstillinger</Button>
      <Button style={{ width: '35%' }} variant="contained" disabled={hasStarted} color="primary" size="large"
              onClick={() => startService()}>
        {!hasStarted ? 'Start' : 'Streaming data..'}
      </Button>
    </div>;
  };

  const renderMain = () => {
    return <div style={styles.main}>
      <Autocomplete
        id="combo-box-demo"
        options={games}
        value={value}
        disabled={hasStarted}
        onChange={(event: any, newValue: string | null) => setValue(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        getOptionLabel={(option: any) =>
          `${option.gameTime}: ${option.homeTeam} - ${option.awayTeam} (${option.tournament})`}
        style={{ width: '60%' }}
        renderInput={(params: any) => (<TextField {...params} variant="outlined" label="Kampe"/>)}
      />
    </div>;
  };

  const renderSettings = () => {
    return <div style={{
      width: '35%',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <TextField disabled={hasStarted} style={styles.textField} variant="outlined" value={directory}
                 label="Output mappe" onClick={() => directoryClicked()}/>
      <TextField disabled={hasStarted} style={styles.textField} variant="outlined" value={timeToClear}
                 label="Tid før clearing" onChange={(x) => setTimeToClear(x.target.value)} InputProps={{
        endAdornment: <InputAdornment position="end">sekunder</InputAdornment>
      }}/>
      <TextField style={styles.textField} variant="outlined"
                 onBlur={() => uploadLink()} value={streamingLink}
                 label="Streaming link til Simply Hockey" onChange={(x) => setStreamingLink(x.target.value)}
      />
    </div>;
  };

  useEffect(() => {
    if (value) saveDummies(directory);
  }, [value, directory]);

  const uploadLink = () => {
    if (value && streamingLink)
      setStreaming((value as any).ID, streamingLink).then(() => setUploadSuccess(true));
  };

  async function directoryClicked() {
    const picked = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    const folder = picked.filePaths[0];
    if (folder) setDirectory(folder);
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div style={styles.container}>
        <Paper style={styles.paper}>
          {renderHeader()}
          <div style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
            {renderMain()}
            {showSettings && renderSettings()}
          </div>
          {renderButtons()}
          <Snackbar open={showUploadSuccess} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Streaming link tilføjet til Simply Hockey!
            </Alert>
          </Snackbar>
        </Paper>
      </div>
    </MuiThemeProvider>
  );
}


