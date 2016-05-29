using System.Diagnostics;
using System.Web.Http;
using Bezier.Models;

namespace Bezier.Controllers
{
    public class DeCasteljauController : ApiController
    {
        public IHttpActionResult CalculateDeCasteljau([FromBody]DeCasteljau dc)
        {

            Debug.WriteLine(dc);

            var resultPoints = new Point[dc.Points.Count + 1];

            for (int i = dc.Points.Count - 1; i > 0; i--)
            {
                for (int j = 0; j < i; j++)
                {
                    if (i == dc.Points.Count - 1)
                    {
                        resultPoints[j] = new Point
                        {
                            X = (1 - dc.U)*dc.Points[j].X + dc.U*dc.Points[j + 1].X,
                            Y = (1 - dc.U)*dc.Points[j].Y + dc.U*dc.Points[j + 1].Y
                        };

                    }
                    else
                    {
                        resultPoints[j] = new Point
                        {
                            X = (1 - dc.U) * resultPoints[j].X + dc.U * resultPoints[j + 1].X,
                            Y = (1 - dc.U) * resultPoints[j].Y + dc.U * resultPoints[j + 1].Y
                        };
                    }
                }
            }

            return Ok(resultPoints[0]);
        }
    }
}
