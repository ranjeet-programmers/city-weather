import React, { useState } from "react";
import { Button, TextField, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { WeatherType } from "../../ResponseTypes/WeatherType";
import { CountriesType } from "../../ResponseTypes/Countries";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  table: {
    minWidth: 650,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function Home() {
  const classes = useStyles();

  const [country, setCountry] = useState<string | null>();
  const [data, setData] = useState<CountriesType>([]);
  const [check, setCheck] = useState(false);
  const [weather, setWeather] = useState<WeatherType | null>();
  const [flag, setFlag] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .get(`https://restcountries.com/v3.1/name/${country}`)
      .then((res) => {
        setData(res.data);
        setCheck(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCapital = (data: string) => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=f34fc1ce71806010d1c260671b62d067&query=${data}`
      )
      .then((res) => {
        console.log(res.data.success);
        if (res.data.success !== false) {
          setWeather(res.data.current);
          setFlag(true);
        } else {
          setError("Data is Not Available");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clear = () => {
    setCheck(false);
    setWeather(null);
    setFlag(false);
    setError(null);
  };

  return (
    <Container maxWidth="lg">
      {!check ? (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className={classes.root}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="filled-basic"
              label="Enter Country Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCountry(e.target.value)
              }
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!country ? true : false}
          >
            Submit
          </Button>
        </form>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Button
              type="button"
              color="primary"
              onClick={clear}
              variant="contained"
            >
              Back
            </Button>
            <br />
            <br />
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Capital</TableCell>
                    <TableCell align="center">Population</TableCell>
                    <TableCell align="center">Lat/Lang</TableCell>
                    <TableCell align="center">Flag</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.name.official}>
                      <TableCell component="th" scope="row">
                        {row.name.official}
                      </TableCell>
                      <TableCell align="center">{row.capital}</TableCell>
                      <TableCell align="center">{row.population}</TableCell>
                      <TableCell align="center">{row.latlng}</TableCell>
                      <TableCell align="center">
                        <img src={row.flag.png} width="50px" alt="country" />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => getCapital(row.capital[0])}
                          type="button"
                          color="primary"
                          variant="contained"
                        >
                          Capital Weather
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <br />
          </Grid>
          <Grid item xs={4}>
            <div style={{ marginTop: "55px" }}>
              {!error ? (
                flag ? (
                  <Card className={classes.root}>
                    {weather && (
                      <CardContent>
                        <Typography variant="h5" component="h2">
                          Temperature : {weather.temperature} deg C{" "}
                          {weather.weather_icons.length > 0 ? (
                            <img
                              src={weather.weather_icons}
                              width="20px"
                              alt="icon"
                            />
                          ) : null}
                        </Typography>
                        <Typography
                          className={classes.pos}
                          color="textSecondary"
                        >
                          Wind Speed : {weather.wind_speed}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Precip : {weather.precip}
                        </Typography>
                      </CardContent>
                    )}
                  </Card>
                ) : null
              ) : (
                <Typography variant="h5" component="h2">
                  {error}
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
