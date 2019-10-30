package com.pingchuan.weather.Util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.pingchuan.weather.DTO.ContourResult;
import com.pingchuan.weather.DTO.LegendLevel;
import com.pingchuan.weather.DTO.ValuePoint;
import com.pingchuan.weather.DTO.ValuePoints;
import wContour.Contour;
import wContour.Global.Border;
import wContour.Global.PointD;
import wContour.Global.PolyLine;
import wContour.Global.Polygon;
import wContour.Interpolate;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * @description: 计算等值线工具
 * @author: XW
 * @create: 2019-06-01 15:08
 **/
public class ContourUtil {
    public static double MinX = 114.875145;
    public static double MaxX = 119.644440;
    public static double MinY = 29.395222;
    public static double MaxY = 34.655106;
    List<List<PointD>> _clipLines = new ArrayList<>();

    public ContourUtil(String boundFile) {
        if (_clipLines.size() == 0)
            InitBound(boundFile);
    }

    public static List<double[]> CreateGridXY_Delt(double Xlb, double Ylb, double Xrt, double Yrt, double XDelt, double YDelt, double[] var12, double[] var13) {
        int var5 = (int) ((Xrt - Xlb) / XDelt + 1.0D);
        int Yrt1 = (int) ((Yrt - Ylb) / YDelt + 1.0D);
        var12 = new double[var5];
        var13 = new double[Yrt1];

        int Xrt1;
        for (Xrt1 = 0; Xrt1 < var5; ++Xrt1) {
            var12[Xrt1] = Xlb + (double) Xrt1 * XDelt;
        }

        for (Xrt1 = 0; Xrt1 < Yrt1; ++Xrt1) {
            var13[Xrt1] = Ylb + (double) Xrt1 * YDelt;
        }
        List<double[]> list = new ArrayList<>();
        list.add(var12);
        list.add(var13);
        return list;
    }

    private void InitBound(String boundFile) {
        try {
            String s = org.apache.commons.io.FileUtils.readFileToString(new File(boundFile));
            //System.out.println(s);
            JSONObject object = JSON.parseObject(s);
            //JSONObject object = JSONObject.parseObject(s);
            //JSONArray features = object.getJSONArray("features");
            /*for (int i = 0; i < features.size(); i++) {
                JSONObject jsonObject = features.getJSONObject(i);
                JSONObject geometry = jsonObject.getJSONObject("geometry");
                JSONArray coordinates = geometry.getJSONArray("coordinates");
                for (int j = 0; j < coordinates.size(); j++) {
                    List<PointD> line = new ArrayList<PointD>();
                    JSONArray jsonArray = coordinates.getJSONArray(j);
                    for (int k = 0; k < jsonArray.size(); k++) {
                        JSONArray jsonArray1 = jsonArray.getJSONArray(k);
                        PointD point = new PointD(Double.parseDouble(jsonArray1.get(0).toString()), Double.parseDouble(jsonArray1.get(1).toString()));
                        line.add(point);
                    }
                    _clipLines.add(line);
                }
            }*/

            JSONArray latLons = object.getJSONArray("features").getJSONObject(0).getJSONObject("geometry").getJSONArray("coordinates").getJSONArray(0).getJSONArray(0);
            List<PointD> line = new ArrayList<PointD>();
            for (int x = 0, len = latLons.size(); x < len; x++){
                PointD point = new PointD(Double.parseDouble(latLons.getJSONArray(x).get(0).toString()), Double.parseDouble(latLons.getJSONArray(x).get(1).toString()));
                line.add(point);
            }
            _clipLines.add(line);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ContourResult Calc(List<ValuePoint> points, List<LegendLevel> levels, int numberOfNearestNeighbors, double missData) {

        double[][] _gridData;
        double[][] _discreteData;
        double[] _X = {};
        double[] _Y = {};
        double[] _CValues;
        double _undefData = -9999.0;
        List<Border> _borders;
        List<PolyLine> _contourLines;
        List<PolyLine> _clipContourLines;
        List<Polygon> _contourPolygons;
        List<Polygon> _clipContourPolygons;
        try {
            _discreteData = new double[3][points.size()];
           /* for (int i = 0; i < points.size(); i++) {
                _discreteData[0][i] = points.get(i).getLongitude().doubleValue();
                _discreteData[1][i] = points.get(i).getLatitude().doubleValue();
                _discreteData[2][i] = points.get(i).getValue().doubleValue();
            }*/

            List<double[]> list = CreateGridXY_Delt(MinX, MinY, MaxX, MaxY, 0.1, 0.1, _X, _Y);

            _X = list.get(0);
            _Y = list.get(1);
            _gridData = Interpolate.Interpolation_IDW_Neighbor(_discreteData, _X, _Y, numberOfNearestNeighbors, _undefData);

            double[] values = new double[levels.size() + 1];
            for (int i = 0; i < levels.size(); i++) {
                if (i == 0) {
                    values[i] = levels.get(i).getBeginValue();
                }
                values[i + 1] = levels.get(i).getEndValue();
            }
            _CValues = values;
            int nc = _CValues.length;
            int[][] S1 = new int[_gridData.length][_gridData[0].length];
            _borders = Contour.tracingBorders(_gridData, _X, _Y, S1, _undefData);
            _contourLines = Contour.tracingContourLines(_gridData, _X, _Y, nc, _CValues, _undefData, _borders, S1);
            _contourLines = Contour.smoothLines(_contourLines);

            _clipContourLines = new ArrayList<>();
            for (List<PointD> cLine : _clipLines) {
                _clipContourLines.addAll(Contour.clipPolylines(_contourLines, cLine));
            }

            _contourPolygons = Contour.tracingPolygons(_gridData, _contourLines, _borders, _CValues);
            _clipContourPolygons = new ArrayList<>();
            for (List<PointD> cLine : _clipLines) {
                _clipContourPolygons.addAll(Contour.clipPolygons(_contourPolygons, cLine));
            }

            ContourResult contourResult = new ContourResult();
            contourResult.setSpotPolygons(_clipContourPolygons);
            contourResult.setContourPolylines(_clipContourLines);
            contourResult.setLegendLevels(levels);
            return contourResult;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public ContourResult Calcs(List<ValuePoints> points,List<LegendLevel> levels, int numberOfNearestNeighbors, double missData) {

        double[][] _gridData;
        double[][] _discreteData;
        double[] _X = {};
        double[] _Y = {};
        double[] _CValues;
        double _undefData = -9999.0;
        List<Border> _borders;
        List<PolyLine> _contourLines;
        List<PolyLine> _clipContourLines;
        List<Polygon> _contourPolygons;
        List<Polygon> _clipContourPolygons;
        try {
            _discreteData = new double[3][points.size()];
            for (int i = 0; i < points.size(); i++) {
                _discreteData[0][i] = points.get(i).getLongitude();
                _discreteData[1][i] = points.get(i).getLatitude();
                _discreteData[2][i] = points.get(i).getValue();
            }

            List<double[]> list = CreateGridXY_Delt(MinX, MinY, MaxX, MaxY, 0.1, 0.1, _X, _Y);

            _X = list.get(0);
            _Y = list.get(1);
            _gridData = Interpolate.Interpolation_IDW_Neighbor(_discreteData, _X, _Y, numberOfNearestNeighbors, _undefData);

            double[] values = new double[levels.size() + 1];
            for (int i = 0; i < levels.size(); i++) {
                if (i == 0) {
                    values[i] = levels.get(i).getBeginValue();
                }
                values[i + 1] = levels.get(i).getEndValue();
            }

            _CValues = values;
            int nc = _CValues.length;
            int[][] S1 = new int[_gridData.length][_gridData[0].length];
            _borders = Contour.tracingBorders(_gridData, _X, _Y, S1, _undefData);
            _contourLines = Contour.tracingContourLines(_gridData, _X, _Y, nc, _CValues, _undefData, _borders, S1);
            _contourLines = Contour.smoothLines(_contourLines);

            _clipContourLines = new ArrayList<>();
            for (List<PointD> cLine : _clipLines) {
                _clipContourLines.addAll(Contour.clipPolylines(_contourLines, cLine));
            }

            _contourPolygons = Contour.tracingPolygons(_gridData, _contourLines, _borders, _CValues);
            _clipContourPolygons = new ArrayList<>();
            for (List<PointD> cLine : _clipLines) {
                _clipContourPolygons.addAll(Contour.clipPolygons(_contourPolygons, cLine));
            }

            ContourResult contourResult = new ContourResult();
            contourResult.setContourPolylines(_clipContourLines);
            contourResult.setLegendLevels(levels);
            contourResult.setSpotPolygons(_clipContourPolygons);
           // contourResult.setValuePoints(points);
            return contourResult;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
