using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Bezier.Models;

namespace Bezier.Controllers
{
    public class DeCasteljauVectorController : ApiController
    {
        // GET: DeCasteljauVector
        public IHttpActionResult Compute([FromBody] DeCasteljauVector dc)
        {
            var resultVectors = new Vector[dc.Vectors.Count + 1];

            for (int i = dc.Vectors.Count - 1; i > 0; i--)
            {
                for (int j = 0; j < i; j++)
                {
                    if (i == dc.Vectors.Count - 1)
                    {
                        resultVectors[j] = new Vector
                        {
                            X = (1 - dc.U)*dc.Vectors[j].X + dc.U*dc.Vectors[j + 1].X,
                            Y = (1 - dc.U)*dc.Vectors[j].Y + dc.U*dc.Vectors[j + 1].Y,
                            Z = (1 - dc.U)*dc.Vectors[j].Z + dc.U*dc.Vectors[j + 1].Z,
                        };
                    }
                    else
                    {
                        resultVectors[j] = new Vector
                        {
                            X = (1 - dc.U)*resultVectors[j].X + dc.U*resultVectors[j + 1].X,
                            Y = (1 - dc.U)*resultVectors[j].Y + dc.U*resultVectors[j + 1].Y,
                            Z = (1 - dc.U)*resultVectors[j].Z + dc.U*resultVectors[j + 1].Z,
                        };
                    }
                }
            }

            return Ok(resultVectors[0]);
        }
    }
}